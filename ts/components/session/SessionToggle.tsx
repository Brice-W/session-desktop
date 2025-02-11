import React from 'react';
import classNames from 'classnames';
import { updateConfirmModal } from '../../state/ducks/modalDialog';

interface Props {
  active: boolean;
  onClick: any;
  confirmationDialogParams?: any | undefined;

  updateConfirmModal?: any;
}

interface State {
  active: boolean;
}

export class SessionToggle extends React.PureComponent<Props, State> {
  public static defaultProps = {
    onClick: () => null,
  };

  constructor(props: any) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);

    const { active } = this.props;

    this.state = {
      active: active,
    };
  }

  public render() {
    return (
      <div
        className={classNames('session-toggle', this.state.active ? 'active' : '')}
        role="button"
        onClick={this.clickHandler}
      >
        <div className="knob" />
      </div>
    );
  }

  private clickHandler(event: any) {
    const stateManager = (e: any) => {
      this.setState({
        active: !this.state.active,
      });

      if (this.props.onClick) {
        e.stopPropagation();
        this.props.onClick();
      }
    };

    if (
      this.props.confirmationDialogParams &&
      this.props.updateConfirmModal &&
      this.props.confirmationDialogParams.shouldShowConfirm()
    ) {
      // If item needs a confirmation dialog to turn ON, render it
      const closeConfirmModal = () => {
        this.props.updateConfirmModal(null);
      };

      this.props.updateConfirmModal({
        onClickOk: () => {
          stateManager(event);
          closeConfirmModal();
        },
        onClickClose: () => {
          this.props.updateConfirmModal(null);
        },
        ...this.props.confirmationDialogParams,
        updateConfirmModal,
      });

      return;
    }

    stateManager(event);
  }
}
