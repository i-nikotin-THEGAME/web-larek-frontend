import { IEvents } from './base/events';
import { Component } from './base/Component';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	paymentValues: string;
	error: Record<string, string>;
}

export class Order extends Component<IForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected payment: NodeListOf<HTMLButtonElement>;
	private activePaymentButton: HTMLButtonElement | null = null;
	protected errors: HTMLElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected successButton: HTMLButtonElement | null = null;
	successDescription: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this.payment = this.container.querySelectorAll<HTMLButtonElement>(
			'.button[type="button"]'
		);
		this.formName = this.container.getAttribute('name') || 'success';
		this.submitButton = this.container.querySelector('.button[type="submit"]');
		this.successButton = this.container.querySelector('.order-success__close');
		this.successDescription = this.container.querySelector(
			'.order-success__description'
		);
		this.errors = this.container.querySelector('.form__errors');
		if (this.submitButton) {
			this.container.addEventListener('submit', (evt) => {
				evt.preventDefault();
				this.events.emit(`${this.formName}:submit`, { order: this });
			});
		}
		this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
		this.payment.forEach((button: HTMLButtonElement) => {
			button.addEventListener('click', (event) => {
				const target = event.currentTarget as HTMLButtonElement;
				this.events.emit(
					`${this.formName}_payment:checked`,
					this.checkedPayment(target)
				);
			});
		});
		if (this.successButton) {
			this.successButton.addEventListener('click', () => {
				this.events.emit(`${this.formName}:close`);
			});
		}
	}

	private checkedPayment(target: HTMLButtonElement): { payment: string } {
		if (this.activePaymentButton === target) {
			return { payment: target.name };
		}

		this.payment.forEach((button) => {
			button.classList.add('button_alt');
			button.classList.remove('button_alt-active');
		});
		target.classList.remove('button_alt');
		target.classList.add('button_alt-active');
		this.activePaymentButton = target;

		return { payment: target.name };
	}

	set error(validInformation: string) {
		if (validInformation) {
			this.showInputError(validInformation);
		} else {
			this.hideInputError();
		}
	}

	protected showInputError(errorMessage: string) {
		this.errors.textContent = errorMessage;
		this.errors.classList.add('modal__message_error');
	}

	protected hideInputError() {
		this.errors.classList.remove('modal__message_error');
		this.errors.textContent = '';
	}

	set valid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}

	resetForm(): void {
		this.payment.forEach((button) => {
			button.classList.add('button_alt');
			button.classList.remove('button_alt-active');
		});
		this.activePaymentButton = null;
		this.inputs.forEach((input) => {
			input.value = '';
		});
	}
}
