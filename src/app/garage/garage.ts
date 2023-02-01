import { garage } from '../types';

class Garage {
    draw(garageData: Array<garage>): void {
        const fragment = document.createDocumentFragment();
        const carTemplate = document.querySelector('#carTemplate') as HTMLTemplateElement;
        garageData.forEach((car) => {
            const carClone = carTemplate.content.cloneNode(true) as HTMLElement;
            (carClone.querySelector('.car__img') as SVGElement).style.fill = car.color;
            (carClone.querySelector('.car__title') as HTMLElement).textContent = car.name;
            (carClone.querySelector('.car') as HTMLElement).setAttribute('data-carId', `${car.id}`);
            fragment.append(carClone);
        });
        (document.querySelector('#garageList') as HTMLElement).innerHTML = '';
        (document.querySelector('#garageList') as HTMLElement).appendChild(fragment);
    }
}

export default Garage;
