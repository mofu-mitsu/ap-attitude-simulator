export type Sender = string;

export interface MessageData {
  id: string;
  sender: Sender;
  text: string;
  delay?: number;
  metadata?: any;
}

export interface APScores {
  v?: number;
  l?: number;
  e?: number;
  f?: number;
}

export interface ChoiceOption {
  label: string;
  value?: string;
  next?: string;
  scores: {
    attitude?: Record<string, number>;
    first?: APScores;
    second?: APScores;
    third?: APScores;
    fourth?: APScores;
  };
  metadata?: any;
}

export type InputType = 'choice' | 'checkbox' | 'slider-bug' | 'slider-darling' | 'read-receipt' | 'text' | 'avatar-builder' | 'darling-redpen' | 'timeline' | 'priority-tap' | 'text-erase' | 'group-chat' | 'text-glitch' | 'posture-check' | 'dice' | 'incoming-call'
  | 'observation-chat' | 'sortable-rank' | 'disabled-choices' | 'none';

export interface ScenarioStep {
  id: string;
  messages: MessageData[];
  inputType: InputType;
  options?: ChoiceOption[];
}
