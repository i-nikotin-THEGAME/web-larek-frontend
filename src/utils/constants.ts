export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const constraintsOrder = {
	payment: {
		presence: { message: '^Не выбран способ оплаты', allowEmpty: false },
	},
	address: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 300,
			tooShort: '^Слишком короткое имя, необходимо %{count} буквы или больше',
			tooLong: '^Слишком длинное имя, необходимо %{count} букв или меньше',
		},
		format: {
			pattern: /^[а-яёА-ЯЁ0-9\s.,-]+(?:\/[а-яёА-ЯЁ0-9\s.,-]+)*$/u,
			message: '^Разрешены только кириллические буквы, символы (точка, запятая, дефис и пробел)',
		},
	},
};

export const constraintsContacts = {
	email: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		email: {message: '^Некорректный адрес электронной почты'}
	},
    phone: {
        presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		format: {
			pattern: /^\+\d{1,3}\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
			message: '^Разрешены только цифры, символы (дефис и круглые скобки). Номер должен начинаться со знака +',
		},
    }
};