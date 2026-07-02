import type { Meta, StoryObj } from '@storybook/nextjs';
import Stack from '@mui/material/Stack';
import StatusChip from '../../shared/components/ui/StatusChip';
import type { Flight } from '../../domain/flights/types';

const meta = {
  title: 'UI/StatusChip',
  component: StatusChip,
  args: {
    status: 'On Time',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['On Time', 'Delayed', 'Boarding', 'Departed', 'Arrived', 'Cancelled'],
    },
  },
} satisfies Meta<typeof StatusChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => {
    const statuses: Flight['status'][] = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Arrived', 'Cancelled'];

    return (
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {statuses.map((status) => (
          <StatusChip key={status} status={status} />
        ))}
      </Stack>
    );
  },
};