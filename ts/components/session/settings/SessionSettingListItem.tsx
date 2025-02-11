import React from 'react';
import classNames from 'classnames';

import Slider from 'rc-slider';

import { SessionToggle } from '../SessionToggle';
import { SessionButton } from '../SessionButton';
import { SessionSettingType } from './SessionSettings';
import { SessionRadioGroup } from '../SessionRadioGroup';
import { SessionConfirmDialogProps } from '../SessionConfirm';

interface Props {
  title?: string;
  description?: string;
  type: SessionSettingType | undefined;
  value: any;
  options?: Array<any>;
  onClick?: any;
  onSliderChange?: any;
  content: any;
  confirmationDialogParams?: SessionConfirmDialogProps;

  // for updating modal in redux
  updateConfirmModal?: any;
}

interface State {
  sliderValue: number | null;
}

export class SessionSettingListItem extends React.Component<Props, State> {
  public static defaultProps = {
    inline: true,
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      sliderValue: null,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  public render(): JSX.Element {
    const { title, description, type, value, content } = this.props;
    const inline =
      !!type && ![SessionSettingType.Options, SessionSettingType.Slider].includes(type);

    const currentSliderValue =
      type === SessionSettingType.Slider && (this.state.sliderValue || value);

    return (
      <div className={classNames('session-settings-item', inline && 'inline')}>
        <div className="session-settings-item__info">
          <div className="session-settings-item__title">{title}</div>

          {description && <div className="session-settings-item__description">{description}</div>}
        </div>

        <div className="session-settings-item__content">
          {type === SessionSettingType.Toggle && (
            <div className="session-settings-item__selection">
              <SessionToggle
                active={Boolean(value)}
                onClick={this.handleClick}
                confirmationDialogParams={this.props.confirmationDialogParams}
                updateConfirmModal={this.props.updateConfirmModal}
              />
            </div>
          )}

          {type === SessionSettingType.Button && (
            <SessionButton
              text={content.buttonText}
              buttonColor={content.buttonColor}
              onClick={this.handleClick}
            />
          )}

          {type === SessionSettingType.Options && (
            <SessionRadioGroup
              initialItem={content.options.initalItem}
              group={content.options.group}
              items={content.options.items}
              onClick={(selectedRadioValue: string) => {
                this.props.onClick(selectedRadioValue);
              }}
            />
          )}

          {type === SessionSettingType.Slider && (
            <div className="slider-wrapper">
              <Slider
                dots={true}
                step={content.step}
                min={content.min}
                max={content.max}
                defaultValue={currentSliderValue}
                onAfterChange={sliderValue => {
                  this.handleSlider(sliderValue);
                }}
              />

              <div className="slider-info">
                <p>{content.info(currentSliderValue)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private handleClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  private handleSlider(value: any) {
    if (this.props.onSliderChange) {
      this.props.onSliderChange(value);
    }

    this.setState({
      sliderValue: value,
    });
  }
}
