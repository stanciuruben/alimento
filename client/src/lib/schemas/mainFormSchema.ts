import * as yup from 'yup';

const mainFormSchema = yup.object().shape({
	useMacros: yup.boolean(),
	protein: yup.number().max(400).min(0),
	carbs: yup.number().max(500).min(0),
	fat: yup.number().max(400).min(0),
	kcal: yup.number().max(5000).min(1000)
});

export default mainFormSchema;
