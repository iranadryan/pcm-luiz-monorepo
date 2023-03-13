import { Plus, Trash } from 'phosphor-react';
import { useState } from 'react';
import { Activity, FormData, Material } from '../..';
import { Button } from '../../../../components/Button';
import { DateInput } from '../../../../components/DateInput';
import { Option, Select } from '../../../../components/Select';
import { TimeInput } from '../../../../components/TimeInput';
import { NoData } from '../../../../components/NoData';
import { ActivitiesList, ActivityInput } from './styles';
import { AddMaterialModal } from '../AddMaterialModal';

interface ActivityStepProps {
  activityOptions: Option[];
  performerOptions: Option[];
  materialOptions: Option[];
  materialUnits: {
    id: string;
    unit: string;
  }[];
  data: FormData;
  onDataChange: (
    name: keyof FormData, data: string | number | Activity[]
  ) => void;
}

export function ActivitiesStep({
  activityOptions,
  performerOptions,
  materialOptions,
  materialUnits,
  data,
  onDataChange,
}: ActivityStepProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [materialModalIsVisible, setMaterialModalIsVisible] = useState(false);
  const [
    addMaterialActivityId,
    setAddMaterialActivityId
  ] = useState<null | string>(null);

  function handleAddActivity() {
    const activities = [...data.activities];

    if (!selectedActivity) {
      return;
    }

    activities.push({
      id: self.crypto.randomUUID(),
      activityId: selectedActivity,
      name: activityOptions.find(
        (option) => option.value === selectedActivity
      )?.label || '',
      startTime: data.startTime,
      endTime: data.startTime,
      endDate: data.startDate,
      performer: null,
      materials: []
    });

    onDataChange('activities', activities);
  }

  function handleRemoveActivity(activityId: string) {
    let activities = [...data.activities];
    activities = activities.filter(({ id }) => id !== activityId);

    onDataChange('activities', activities);
  }

  function handleChangeActivityData(
    id: string,
    name: keyof Activity,
    value: string | number
  ) {
    const activities = [...data.activities];
    const activityIndex = activities.findIndex(
      (activity) => activity.id === id
    );

    if (activityIndex === -1) {
      return;
    }

    activities[activityIndex] = {
      ...activities[activityIndex],
      [name]: value,
    };

    onDataChange('activities', activities);
  }

  function handleAddMaterial(activityId: string, material: Material) {
    const activities = [...data.activities];
    const activityIndex = activities.findIndex(
      (activity) => activity.id === activityId
    );

    if (activityIndex === -1) {
      return;
    }

    const materials = [...data.activities[activityIndex].materials];
    const materialAlreadyExists = materials.find(
      ({ id }) => id === material.id
    );

    if (materialAlreadyExists) {
      return;
    }

    materials.push(material);

    activities[activityIndex] = {
      ...activities[activityIndex],
      materials: materials,
    };

    onDataChange('activities', activities);
  }

  function handleRemoveMaterial(activityId: string, materialId: string) {
    const activities = [...data.activities];
    const activityIndex = activities.findIndex(
      (activity) => activity.id === activityId
    );

    if (activityIndex === -1) {
      return;
    }

    let materials = [...data.activities[activityIndex].materials];
    materials = materials.filter(({ id }) => id !== materialId);

    activities[activityIndex] = {
      ...activities[activityIndex],
      materials: materials,
    };

    onDataChange('activities', activities);
  }

  return (
    <>
      <AddMaterialModal
        isVisible={materialModalIsVisible}
        closeModal={() => setMaterialModalIsVisible(false)}
        activityId={addMaterialActivityId}
        materialOptions={materialOptions}
        materialUnits={materialUnits}
        onAddMaterial={handleAddMaterial}
      />
      <div className="add-activity">
        <Select
          placeholder="Selecione uma atividade"
          options={activityOptions}
          selected={selectedActivity}
          onSelect={setSelectedActivity}
        />
        <button onClick={handleAddActivity}>
          <Plus color="#FFFFFF" size={20} weight="bold" />
        </button>
      </div>
      <ActivitiesList>
        {data.activities.length === 0 && (
          <NoData
            title="Nenhuma atividade inserida!"
            text="Aqui você insere as atividades da sua ordem"
          />
        )}
        {data.activities.map((activity) => (
          <ActivityInput key={activity.id}>
            <header>
              <h3>{activity.name}</h3>
              <button onClick={
                () => handleRemoveActivity(activity.id)
              }>
                <Trash size={20} color="#E12729" weight="duotone" />
              </button>
            </header>
            <div className="card">
              <TimeInput
                label="Hora Inicial"
                value={activity.startTime}
                onChange={(value) => {
                  handleChangeActivityData(activity.id, 'startTime', value);
                }}
              />
              <TimeInput
                label="Hora Final"
                value={activity.endTime}
                onChange={(value) => {
                  handleChangeActivityData(activity.id, 'endTime', value);
                }}
              />
              <DateInput
                label="Data Final"
                value={activity.endDate}
                onChange={(value) => {
                  handleChangeActivityData(activity.id, 'endDate', value);
                }}
              />
              <Select
                label="Executante"
                placeholder="Selecione"
                options={performerOptions}
                selected={activity.performer}
                onSelect={(value) => {
                  handleChangeActivityData(activity.id, 'performer', value);
                }}
              />
              {activity.materials.length > 0 && (
                <div className="stretch material-list">
                  {activity.materials.map((material) => (
                    <div key={material.id} className="material-item">
                      <span>{`${material.quantity} ${material.unit}`}</span>
                      <strong>{material.name}</strong>
                      <button onClick={
                        () => handleRemoveMaterial(activity.id, material.id)
                      }>
                        <Trash size={20} color="#E12729" weight="duotone" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                secondary
                className="right-side"
                onClick={() => {
                  setAddMaterialActivityId(activity.id);
                  setMaterialModalIsVisible(true);
                }}
              >
                <Plus size={16} color="#FFFFFF" weight="bold" />
                Material
              </Button>
            </div>
          </ActivityInput>
        ))}
      </ActivitiesList>
    </>
  );
}
