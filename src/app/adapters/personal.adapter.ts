import { GenericPersonal, PersonalApi } from '@models/personal';

export const createMessengerAdapter = (personalApi: PersonalApi): GenericPersonal => {
  return {
    id: personalApi.IdPersonal,
    text: `${personalApi?.Codigo} - ${personalApi?.Nombres}`,
    grupo: '',
  };
};
