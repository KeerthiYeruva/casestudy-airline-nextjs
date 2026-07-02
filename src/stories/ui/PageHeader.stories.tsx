import SettingsIcon from '@mui/icons-material/Settings';
import type { Meta, StoryObj } from '@storybook/nextjs';
import PageHeader from '../../components/ui/PageHeader';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  args: {
    title: 'Admin Dashboard',
    description: 'Manage passengers, flights, and services',
    isConnected: true,
    selectedFlightNumber: 'AA101',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    icon: <SettingsIcon color="primary" />,
  },
};

export const Offline: Story = {
  args: {
    isConnected: false,
    selectedFlightNumber: undefined,
  },
};