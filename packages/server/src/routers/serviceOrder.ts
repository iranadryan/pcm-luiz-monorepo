import moment from 'moment';
import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import {
  changeNumberInputSchemaValidation,
  closeInputSchemaValidation,
  createInputSchemaValidation,
  listOutputSchemaValidation,
  updateInputSchemaValidation,
} from './schemasValidation/serviceOrder';
import { formatNumber } from '../utils/formatNumber';
import { TRPCError } from '@trpc/server';

export const serviceOrderRouter = router({
  list: publicProcedure
    .output(listOutputSchemaValidation)
    .query(async () => {
      const serviceOrders = await prisma.serviceOrder.findMany({
        select: {
          id: true,
          number: true,
          status: true,
          startDate: true,
          endDate: true,
          truck: {
            select: {
              plate: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          { startDate: 'desc' },
          { startTime: 'desc' },
        ]
      });

      return serviceOrders;
    }),
  get: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const serviceOrder = await prisma.serviceOrder.findUnique({
        select: {
          id: true,
          number: true,
          status: true,
          startDate: true,
          startTime: true,
          endDate: true,
          endTime: true,
          odometer: true,
          observation: true,
          truck: {
            select: {
              plate: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
          ServiceOrderService: {
            select: {
              id: true,
              description: true,
              startDate: true,
              startTime: true,
              endDate: true,
              endTime: true,
              isEnded: true,
              service: {
                select: {
                  code: true,
                  name: true,
                }
              },
              executor: {
                select: {
                  name: true,
                }
              },
              ServiceOrderServiceMaterial: {
                select: {
                  id: true,
                  quantity: true,
                  material: {
                    select: {
                      code: true,
                      name: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: input
        }
      });

      if (!serviceOrder) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      return serviceOrder;
    }),
  create: publicProcedure
    .input(createInputSchemaValidation)
    .mutation(async ({ input }) => {
      const { services } = input;
      const isScheduled = services.reduce((value, curr) => {
        if (curr.executorId === 'c5bcdd68-3c66-4bb9-b3fe-20d3316ae0d5') {
          return true;
        }

        return false;
      }, false);
      const serviceOrderInput = {
        startDate: input.startDate,
        startTime: input.startTime,
        truckId: input.truckId,
        driverId: input.driverId,
        odometer: input.odometer,
        observation: input.observation,
      };
      const serviceOrder = await prisma.serviceOrder.create({
        data: {
          ...serviceOrderInput,
          status: isScheduled ? 'SCHEDULED' : undefined
        }
      });

      for (const service of services) {
        const { materials } = service;
        const serviceOrderServiceInput = {
          serviceId: service.serviceId,
          executorId: service.executorId,
          startDate: service.startDate,
          startTime: service.startTime,
          endDate: service.endDate,
          endTime: service.endTime,
          description: service.description,
          isEnded: service.isEnded,
          serviceOrderId: serviceOrder.id,
        };
        const serviceOrderService = await prisma.serviceOrderService.create({
          data: serviceOrderServiceInput,
        });

        for (const material of materials) {
          await prisma.serviceOrderServiceMaterial.create({
            data: {
              ...material,
              serviceOrderServiceId: serviceOrderService.id
            },
          });
        }
      }

      return serviceOrder;
    }),
  getUpdateFormData: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const serviceOrder = await prisma.serviceOrder.findUnique({
        select: {
          id: true,
          startDate: true,
          startTime: true,
          odometer: true,
          observation: true,
          truck: {
            select: {
              id: true
            },
          },
          driver: {
            select: {
              id: true,
            },
          },
          ServiceOrderService: {
            select: {
              id: true,
              startDate: true,
              startTime: true,
              endDate: true,
              endTime: true,
              description: true,
              isEnded: true,
              service: {
                select: {
                  id: true,
                  code: true,
                  name: true
                }
              },
              executor: {
                select: {
                  id: true,
                }
              },
              ServiceOrderServiceMaterial: {
                select: {
                  id: true,
                  quantity: true,
                  material: {
                    select: {
                      id: true,
                      code: true,
                      name: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: input
        }
      });

      if (!serviceOrder) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      return serviceOrder;
    }),
  update: publicProcedure
    .input(updateInputSchemaValidation)
    .mutation(async ({ input }) => {
      const { services } = input;
      const serviceOrderId = input.id;
      const serviceOrderInput = {
        startDate: input.startDate,
        startTime: input.startTime,
        truckId: input.truckId,
        driverId: input.driverId,
        odometer: input.odometer,
        observation: input.observation,
      };

      const serviceOrderExists = await prisma.serviceOrder.findUnique({
        where: {
          id: serviceOrderId
        }
      });

      if (!serviceOrderExists) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      const isScheduled = serviceOrderExists.status !== 'SCHEDULED'
        ? false
        : services.reduce((value, curr) => {
          if (curr.executorId === 'c5bcdd68-3c66-4bb9-b3fe-20d3316ae0d5' && !curr.deleted) {
            return true;
          }

          return false;
        }, false);

      const serviceOrder = await prisma.serviceOrder.update({
        where: {
          id: serviceOrderId,
        },
        data: {
          ...serviceOrderInput,
          status: isScheduled ? 'SCHEDULED' : serviceOrderExists.status === 'SCHEDULED' ? 'OPEN' : serviceOrderExists.status
        }
      });

      for (const service of services) {
        const { materials } = service;
        const serviceOrderServiceId = service.id;
        const serviceOrderServiceInput = {
          serviceId: service.serviceId,
          executorId: service.executorId,
          startDate: service.startDate,
          startTime: service.startTime,
          endDate: service.endDate,
          endTime: service.endTime,
          description: service.description,
          isEnded: service.isEnded,
          serviceOrderId: serviceOrder.id
        };

        if (!serviceOrderServiceId) {
          const serviceOrderService = await prisma.serviceOrderService.create({
            data: serviceOrderServiceInput,
          });

          for (const material of materials) {
            const serviceOrderServiceMaterialInput = {
              materialId: material.materialId,
              quantity: material.quantity,
              serviceOrderServiceId: serviceOrderService.id,
            };

            await prisma.serviceOrderServiceMaterial.create({
              data: serviceOrderServiceMaterialInput,
            });
          }
        } else {
          if (service.deleted) {
            await prisma.serviceOrderService.delete({
              where: {
                id: serviceOrderServiceId
              }
            });
          } else {
            const serviceOrderService = await prisma.serviceOrderService
              .update({
                where: {
                  id: serviceOrderServiceId
                },
                data: serviceOrderServiceInput,
              });

            for (const material of materials) {
              const serviceOrderServiceMaterialId = material.id;
              const serviceOrderServiceMaterialInput = {
                materialId: material.materialId,
                quantity: material.quantity,
                serviceOrderServiceId: serviceOrderService.id,
              };

              if (!serviceOrderServiceMaterialId) {
                await prisma.serviceOrderServiceMaterial.create({
                  data: serviceOrderServiceMaterialInput,
                });
              } else {
                if (material.deleted) {
                  await prisma.serviceOrderServiceMaterial.delete({
                    where: {
                      id: serviceOrderServiceMaterialId
                    }
                  });
                } else {
                  await prisma.serviceOrderServiceMaterial.update({
                    where: {
                      id: serviceOrderServiceMaterialId,
                    },
                    data: serviceOrderServiceMaterialInput,
                  });
                }
              }
            }
          }
        }
      }

      return serviceOrder;
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const serviceOrderExists = await prisma.serviceOrder.findUnique({
        where: {
          id: input
        }
      });

      if (!serviceOrderExists) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      await prisma.serviceOrder.delete({
        where: {
          id: input
        }
      });
    }),
  close: publicProcedure
    .input(closeInputSchemaValidation)
    .mutation(async ({ input }) => {
      const serviceOrderExists = await prisma.serviceOrder.findUnique({
        where: {
          id: input.id
        }
      });

      if (!serviceOrderExists) {
        throw new Error(`Service order does not exists: ${input.id}`);
      }

      const serviceOrder = await prisma.serviceOrder.update({
        where: {
          id: input.id
        },
        data: {
          endDate: input.endDate,
          endTime: input.endTime,
          status: 'CLOSED'
        }
      });
      await prisma.serviceOrderService.updateMany({
        where: {
          serviceOrderId: input.id
        },
        data: {
          isEnded: true,
        }
      });

      return serviceOrder;
    }),
  changeNumber: publicProcedure
    .input(changeNumberInputSchemaValidation)
    .mutation(async ({ input }) => {
      const serviceOrderExists = await prisma.serviceOrder.findUnique({
        where: {
          id: input.id
        }
      });

      if (!serviceOrderExists) {
        throw new Error(`Service order does not exists: ${input.id}`);
      }

      if (serviceOrderExists.status === 'OPEN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Não é possível inserir número a uma ordem aberta',
        });
      }

      const serviceOrder = await prisma.serviceOrder.update({
        where: {
          id: input.id
        },
        data: {
          number: input.number,
          status: 'LAUNCHED'
        }
      });

      return serviceOrder;
    }),
  export: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      const reportUrl = `${baseUrl}/reports/${input}.pdf`;
      const reportPath = path.resolve(__dirname, '..', '..', 'reports', `${input}.pdf`);

      const serviceOrder = await prisma.serviceOrder.findUnique({
        select: {
          id: true,
          number: true,
          status: true,
          startDate: true,
          startTime: true,
          endDate: true,
          endTime: true,
          odometer: true,
          observation: true,
          truck: {
            select: {
              plate: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
          ServiceOrderService: {
            select: {
              id: true,
              startTime: true,
              endDate: true,
              endTime: true,
              service: {
                select: {
                  code: true,
                  name: true,
                }
              },
              executor: {
                select: {
                  name: true,
                }
              },
              ServiceOrderServiceMaterial: {
                select: {
                  id: true,
                  quantity: true,
                  material: {
                    select: {
                      code: true,
                      name: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: input
        }
      });

      if (!serviceOrder) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      const services: {
        index: number;
        name: string;
        performer: string;
        startTime: string;
        endTime: string;
        endDate: string;
      }[] = [];
      const materials: {
        code: number;
        name: string;
        quantity: string;
        activity: number;
      }[] = [];

      serviceOrder.ServiceOrderService.forEach((service, index) => {
        services.push({
          index: index + 1,
          name: service.service.name,
          performer: service.executor.name,
          startTime: moment(service.startTime).subtract(3, 'h').format('HH:mm'),
          endTime: moment(service.endTime).subtract(3, 'h').format('HH:mm'),
          endDate: moment(service.endDate).format('DD/MM/YYYY'),
        });

        service.ServiceOrderServiceMaterial.forEach((material) => {
          materials.push({
            code: material.material.code,
            name: material.material.name,
            quantity: formatNumber(material.quantity),
            activity: index + 1
          });
        });
      });

      const payload = {
        template: {
          name: 'ordem_servico'
        },
        data: {
          orderNumber: serviceOrder.number,
          plate: serviceOrder.truck.plate,
          acumulatedKm: formatNumber(serviceOrder.odometer, ' KM'),
          driver: serviceOrder.driver.name,
          startDate: moment(serviceOrder.startDate).format('DD/MM/YYYY'),
          endDate: moment(serviceOrder.endDate).format('DD/MM/YYYY'),
          startTime: moment(serviceOrder.startTime).subtract(3, 'h').format('HH:mm'),
          endTime: moment(serviceOrder.endTime).subtract(3, 'h').format('HH:mm'),
          observation: serviceOrder.observation,
          materials,
          activities: services
        }
      };

      const { data } = await axios({
        url: 'https://playground.jsreport.net/w/iranadryan/c5fdAGXS/api/report',
        method: 'post',
        data: payload,
        responseType: 'arraybuffer'
      });

      fs.writeFileSync(reportPath, data, 'binary');

      return reportUrl;
    })
});
