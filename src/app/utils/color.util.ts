export class Color{
    static colorConfig(color: string){
        switch (color) {
            case 'green': return '#2FE820';
            case 'gray': return '#B5BDB5';
            default: return '#BBBBBB';
        }
    }

    static colorSlide(status: number){
        switch (status) {
            case 1: return '#34ABF9';
            case 2: return '#3C990B';
            case 3: return '#C1CFBE';
            case 4: return '#FF4E2B';
            default: return '#BBBBBB';
        }
    }
}
