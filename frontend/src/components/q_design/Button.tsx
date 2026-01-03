import React, { useState, ReactNode, ButtonHTMLAttributes } from 'react';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

export type ButtonHierarchy = 'primary' | 'secondary' | 'tertiary';
export type ButtonAction = 'productive' | 'destructive';
export type ButtonState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual importance of the button */
  hierarchy?: ButtonHierarchy;
  /** The nature of the action (e.g., Delete vs Save) */
  action?: ButtonAction;
  /** Force a specific visual state (useful for style guides/testing) */
  state?: ButtonState;
  /** Icon element to display */
  icon?: ReactNode;
  /** Position of the icon relative to text. Defaults to 'left' */
  iconPosition?: 'left' | 'right';
  /** Button label/content */
  children?: ReactNode;
}

// ----------------------------------------------------------------------
// Helper: Style Logic
// ----------------------------------------------------------------------

const getButtonStyles = (
  hierarchy: ButtonHierarchy,
  action: ButtonAction,
  state: ButtonState
): React.CSSProperties => {
  const isDestructive = action === 'destructive';
  const isDisabled = state === 'disabled';

  // Base Defaults
  let background = 'transparent';
  let color = '#2f2f2f'; // Fallback dark text
  let border = 'none'; // Default no border
  // Note: We use a transparent border by default on some variants 
  // to prevent layout shift if switching to a bordered state (like Focus).

  // --- 1. PRIMARY ---
  if (hierarchy === 'primary') {
    color = '#ffffff';
    border = '2px solid transparent'; // maintain box model consistency

    if (isDestructive) {
      // Destructive Primary
      switch (state) {
        case 'hover':
          background = 'var(--color-destructive-hover)';
          break;
        case 'active':
          background = 'var(--color-destructive-active)';
          break;
        case 'focus':
          background = 'var(--color-destructive-default)';
          border = '2px solid var(--color-primary-default)'; // Focus ring logic from spec
          break;
        case 'disabled':
          background = 'var(--color-disabled-background)';
          // Disabled text color not explicitly in tokens, using grey fallback or keeping white if legible
          color = '#adadad'; 
          break;
        default:
          background = 'var(--color-destructive-default)';
          break;
      }
    } else {
      // Productive Primary
      switch (state) {
        case 'hover':
          background = 'var(--color-primary-hover)';
          break;
        case 'active':
          background = 'var(--color-primary-active)';
          break;
        case 'focus':
          background = 'var(--color-primary-default)';
          border = '2px solid var(--color-primary-default)'; // Self border for focus in spec
          break;
        case 'disabled':
          background = 'var(--color-disabled-background)';
          color = '#adadad';
          break;
        default:
          background = 'var(--color-primary-default)';
          break;
      }
    }
  } 
  
  // --- 2. SECONDARY ---
  else if (hierarchy === 'secondary') {
    background = 'transparent';
    
    if (isDestructive) {
      color = 'var(--color-destructive-default)';
      border = '2px solid var(--color-destructive-default)';

      switch (state) {
        case 'hover':
          background = 'var(--color-destructive-subtle-hover)';
          break;
        case 'active':
          background = 'var(--color-destructive-subtle-active)';
          break;
        case 'focus':
          border = '2px solid var(--color-primary-default)'; // Focus override from spec
          break;
        case 'disabled':
          border = '2px solid #adadad'; // Spec literal
          color = '#adadad';
          break;
      }
    } else {
      // Productive Secondary
      color = 'var(--color-primary-default)';
      border = '2px solid var(--color-primary-default)';

      switch (state) {
        case 'hover':
          background = 'var(--color-secondary-hover)';
          break;
        case 'active':
          background = 'var(--color-secondary-active)';
          break;
        case 'focus':
          // Spec usually implies a double border or specific ring, 
          // keeping strict 2px solid primary based on typical focus states.
          break;
        case 'disabled':
          border = '2px solid #adadad';
          color = '#adadad';
          break;
      }
    }
  } 
  
  // --- 3. TERTIARY ---
  else if (hierarchy === 'tertiary') {
    background = 'transparent';
    border = '2px solid transparent'; // Reserved space

    if (isDestructive) {
      color = 'var(--color-destructive-default)';
      switch (state) {
        case 'hover':
          background = 'var(--color-destructive-subtle-hover)';
          break;
        case 'active':
          background = 'var(--color-destructive-subtle-active)';
          break;
        case 'focus':
          border = '2px solid var(--color-primary-default)';
          break;
        case 'disabled':
          color = '#adadad';
          break;
      }
    } else {
      // Productive Tertiary
      color = '#2f2f2f'; // Spec implies standard text color for Tertiary
      switch (state) {
        case 'hover':
          background = 'var(--color-neutral-subtle-hover)';
          break;
        case 'active':
          background = 'var(--color-neutral-subtle-active)';
          break;
        case 'focus':
          border = '2px solid var(--color-primary-default)';
          break;
        case 'disabled':
          color = '#adadad';
          break;
      }
    }
  }

  // Common overrides
  if (isDisabled) {
    // Ensure pointer events are off for styles
    // (Actual disabled behavior handled by HTML attribute)
  }

  return {
    background,
    color,
    border,
  };
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export const Button: React.FC<ButtonProps> = ({
  hierarchy = 'primary',
  action = 'productive',
  state: forcedState,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}) => {
  // 1. Manage Interaction State
  const [internalState, setInternalState] = useState<ButtonState>('default');

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('hover');
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('default');
    onMouseLeave?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('active');
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('hover');
    onMouseUp?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('focus');
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('default');
    onBlur?.(e);
  };

  // 2. Determine Effective State
  // Priority: Disabled Prop > Forced State Prop > Internal Interaction State
  const effectiveState: ButtonState = disabled
    ? 'disabled'
    : forcedState || internalState;

  // 3. Get Theme Styles
  const themeStyles = getButtonStyles(hierarchy, action, effectiveState);

  // 4. Layout & Shape Styles
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Spec: Gap 8px
    padding: '9px 16px', // Spec: Padding 14px 16px
    borderRadius: '5px', // Spec: Radius 5px
    cursor: effectiveState === 'disabled' ? 'not-allowed' : 'pointer',
    fontSize: '16px', // Standard fallback, spec doesn't explicitly limit font size but implies standard
    fontFamily: 'inherit',
    fontWeight: 500,
    outline: 'none', // We handle focus via border/ring
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    ...themeStyles,
    ...style, // Allow consumer overrides
  };

  return (
    <button
      disabled={disabled}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {/* Icon Left */}
      {icon && iconPosition === 'left' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}

      {/* Text Content */}
      {children && <span>{children}</span>}

      {/* Icon Right */}
      {icon && iconPosition === 'right' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
    </button>
  );
};

export default Button;