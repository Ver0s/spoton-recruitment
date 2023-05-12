import { useEffect, useState } from 'react';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import * as Form from '@radix-ui/react-form';
import Spinner from './components/Spinner';

type Company = {
	createdAt: string;
	company_name: string;
	city: string;
	street: string;
	tax_id: string;
	id: string;
};

type FormData = {
	tax_id: string;
	company_name: string;
	city: string;
	street: string;
	unit_price: number;
	quantity: number;
};

const initialFormData = {
	tax_id: '',
	company_name: '',
	city: '',
	street: '',
	unit_price: 0,
	quantity: 0,
};

function App() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const debouncedTaxId = useDebounce<string>(formData.tax_id);
	const { data, isLoading, error } = useFetch<Company[]>(
		`https://64490e52b88a78a8f0fbe291.mockapi.io/api/v1/companies?tax_id=${debouncedTaxId}`,
		() => debouncedTaxId !== '',
		[debouncedTaxId]
	);

	const priceGross = (formData.unit_price * 1.23 * formData.quantity).toFixed(
		2
	);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const invoiceData = {
			...formData,
			price_gross: priceGross,
		};
		alert(JSON.stringify(invoiceData));
		setFormData(initialFormData);
	}

	useEffect(() => {
		if (data !== null && data.length === 1) {
			const unwrappedData = data[0];
			setFormData({
				...formData,
				tax_id: unwrappedData.tax_id,
				company_name: unwrappedData.company_name,
				city: unwrappedData.city,
				street: unwrappedData.street,
			});
		}
	}, [data]);

	return (
		<Form.Root
			className="relative flex max-w-[450px] flex-1 flex-col gap-2 px-4"
			onSubmit={handleSubmit}
		>
			<div className="absolute right-2 top-2">
				{isLoading && <Spinner />}
				{error !== '' && (
					<span className="text-sm text-red-400">
						Can't autocomplete form: {error}
					</span>
				)}
			</div>
			<Form.Field className="grid" name="tax_id">
				<div className="flex items-baseline justify-between">
					<Form.Label className="text-[15px] font-medium leading-[35px]">
						Tax ID
					</Form.Label>
					<Form.Message
						className="text-[13px] text-red-400"
						match="valueMissing"
					>
						Please enter the tax ID
					</Form.Message>
				</div>
				<Form.Control asChild>
					<input
						className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
						type="text"
						required
						value={formData.tax_id}
						onChange={handleChange}
					/>
				</Form.Control>
			</Form.Field>
			<Form.Field className="grid" name="company_name">
				<div className="flex items-baseline justify-between">
					<Form.Label className="text-[15px] font-medium leading-[35px]">
						Company name
					</Form.Label>
					<Form.Message
						className="text-[13px] text-red-400"
						match="valueMissing"
					>
						Please enter the company name
					</Form.Message>
				</div>
				<Form.Control asChild>
					<input
						className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
						type="text"
						required
						value={formData.company_name}
						onChange={handleChange}
					/>
				</Form.Control>
			</Form.Field>
			<Form.Field className="grid" name="city">
				<div className="flex items-baseline justify-between">
					<Form.Label className="text-[15px] font-medium leading-[35px]">
						City
					</Form.Label>
					<Form.Message
						className="text-[13px] text-red-400"
						match="valueMissing"
					>
						Please enter city name
					</Form.Message>
				</div>
				<Form.Control asChild>
					<input
						className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
						type="text"
						required
						value={formData.city}
						onChange={handleChange}
					/>
				</Form.Control>
			</Form.Field>
			<Form.Field className="grid" name="street">
				<div className="flex items-baseline justify-between">
					<Form.Label className="text-[15px] font-medium leading-[35px]">
						Street (number & name)
					</Form.Label>
					<Form.Message
						className="text-[13px] text-red-400"
						match="valueMissing"
					>
						Please enter street name
					</Form.Message>
					<Form.Message
						className="text-[13px] text-red-400"
						match="patternMismatch"
					>
						Please enter a valid street name
					</Form.Message>
				</div>
				<Form.Control asChild>
					<input
						className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
						type="text"
						pattern="\d+\s+\w+(\s+\w+)*"
						required
						value={formData.street}
						onChange={handleChange}
					/>
				</Form.Control>
			</Form.Field>
			<div className="flex justify-between gap-4">
				<Form.Field className="grid" name="unit_price">
					<div className="flex items-baseline justify-between">
						<Form.Label className="text-[15px] font-medium leading-[35px]">
							Price per unit ($)
						</Form.Label>
						<Form.Message
							className="text-[13px] text-red-400"
							match="valueMissing"
						>
							Please enter price
						</Form.Message>
						<Form.Message
							className="text-[13px] text-red-400"
							match="stepMismatch"
						>
							Price can have at most two decimals
						</Form.Message>
					</div>
					<Form.Control asChild>
						<input
							className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
							type="number"
							required
							min={0}
							step={0.01}
							value={formData.unit_price}
							onChange={handleChange}
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className="grid" name="quantity">
					<div className="flex items-baseline justify-between">
						<Form.Label className="text-[15px] font-medium leading-[35px]">
							Quantity
						</Form.Label>
						<Form.Message
							className="text-[13px] text-red-400"
							match="valueMissing"
						>
							Please enter quantity
						</Form.Message>
					</div>
					<Form.Control asChild>
						<input
							className="bg-blackA5 shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-slate-900 shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
							type="number"
							required
							min={0}
							value={formData.quantity}
							onChange={handleChange}
						/>
					</Form.Control>
				</Form.Field>
			</div>
			<span className="text-md font-bold">
				Price gross: {priceGross}$
			</span>
			<Form.Submit asChild>
				<button className="w-full rounded-[4px] bg-slate-300 py-2 font-bold text-slate-900 hover:bg-slate-200">
					Submit
				</button>
			</Form.Submit>
		</Form.Root>
	);
}

export default App;
