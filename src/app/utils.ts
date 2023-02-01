class Utils {

	generateColor(): string {
		let color = '#';
		for (let i = 0; i < 6; i++) {
			const char = Math.ceil(Math.random() * 15).toString(16);
			color += char;
		}
		return color;
	}

	generateCarname(): string {
		const carModel = ['M8', 'CX-5', 'Mustang', 'AMG', 'A8', 'S', 'RCZ', 'Civic', 'I8', 'X6'];
		const carBrand = ['Reno', 'Mazda', 'Honda', 'Reno', 'Ford', 'Pegeot', 'Porsche', 'Mersedes', 'Audi', 'BMW'];
		const modelName = carModel[Math.ceil(Math.random() * 10) - 1];
		const brandName = carBrand[Math.ceil(Math.random() * 10) - 1];
		return `${brandName} ${modelName}`;
	}

	generateCars(): {
		name: string;
		color: string;
	}[] {
		const carsArr = [];
		for (let i = 0; i < 100; i++) {
			carsArr.push({
				name: this.generateCarname(),
				color: this.generateColor(),
			});
		}
		return carsArr;
	}
}

export default Utils;