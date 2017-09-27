export const TEST = () => 'test';

export const TEST2 = () => 'test2';

export const pureFunction = (a) => a * a

export const externalLib = {
    formatData: (string) => string.toLowerCase(),
}

export const externalFactory = () => {
    const propsObj = {
        props: 'props',
    }
    
    const getProps = (props) => propsObj[props] 
    
    const getValueAsync = () => (new Promise((resolve) => resolve('expectedValue')))
    
    return {
        getProps: getProps,
        getValueAsync: getValueAsync,
    }
}

export class TestClass {
    constructor(factory) {
        this.element = '<span>'
        this.factory = factory
    }

    setValue(value) {
        this.value = value
    }

    getValue() {
        return this.value
    }

    updatePropAccordingFactoryMethod(propName, value) {
        this[propName] = this.factory.transformValue(value)
    }

    getFormattedString(string) {
        return externalLib.formatData(string)
    }

    changeStatusAccodingCondition(condition) {
        if (condition) {
            return this.getValue()
        }

        return externalLib.formatData(this.getValue())
    }

    workWithPromise() {
        this.factory.getValueAsync()
            .then(this.setValue.bind(this))
            .catch(this.updatePropAccordingFactoryMethod.bind(this))
    }
}