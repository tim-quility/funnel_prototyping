import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Q Design/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    hierarchy: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The visual importance of the button',
    },
    action: {
      control: 'radio',
      options: ['productive', 'destructive'],
      description: 'The nature of the action (e.g., Delete vs Save)',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'active', 'disabled'],
      description: 'Force a specific visual state (useful for style guides/testing)',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Primary ---
export const Primary: Story = {
  args: {
    hierarchy: 'primary',
    children: 'Primary Button',
  },
};

export const PrimaryDestructive: Story = {
  args: {
    hierarchy: 'primary',
    action: 'destructive',
    children: 'Delete Account',
  },
};

// --- Secondary ---
export const Secondary: Story = {
  args: {
    hierarchy: 'secondary',
    children: 'Secondary Button',
  },
};

export const SecondaryDestructive: Story = {
  args: {
    hierarchy: 'secondary',
    action: 'destructive',
    children: 'Cancel',
  },
};

// --- Tertiary ---
export const Tertiary: Story = {
  args: {
    hierarchy: 'tertiary',
    children: 'Tertiary Button',
  },
};

export const TertiaryDestructive: Story = {
  args: {
    hierarchy: 'tertiary',
    action: 'destructive',
    children: 'Dismiss',
  },
};

// --- States ---
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const WithIconLeft: Story = {
  args: {
    children: 'With Icon',
    icon: <span>👋</span>,
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'Next Step',
    icon: <span>➡️</span>,
    iconPosition: 'right',
  },
};
