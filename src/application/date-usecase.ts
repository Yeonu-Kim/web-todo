import type { DateRepository } from '../domain/date-interface';

export const implDateUsecase = ({
  dateRepository,
}: {
  dateRepository: DateRepository;
}) => ({
  getNow: () => {
    const now = dateRepository.getNow();

    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const day = now.getDate();

    return `${weekday}, ${month} ${day}`;
  },
});
