import {
    TEST,
    TEST2,
    externalLib,
    externalFactory,
    pureFunction,
    TestClass
} from './app.js'

describe('base', () => {
    it('syntax', () => {
        let value

        expect(1).toBe(1)
        expect(1).toBeDefined()

        expect(value).toBeUndefined()
        expect(value).not.toBeDefined()

        expect([]).toEqual([])
        expect({a: value, b: () => 1}).toEqual(jasmine.any(Object, {
            a: value,
            b: jasmine.any(Function)
        }))
    })
})

describe('test methods', () => {
    const methods = [TEST, TEST2]
    const EXPECTED_VALUE = {
        TEST: 'test',
        TEST2: 'test2',
    }

    it('should return expected values', () => {
        methods.map((method) => expect(method()).toBe(EXPECTED_VALUE[method.name]))
    })
})

describe('pureFunction', () => {
    it('should return square of the argument', () => {
        const arg = 2

        const result = pureFunction(arg)

        expect(result).toBe(arg * arg)
    })
})

describe('externalFactory', () => {
    let factory

    beforeEach(() => {
        factory = externalFactory()
    })

    describe('#getProps', () => {
        let getProps

        beforeEach(() => {
            getProps = factory.getProps
        })

        it('should return props of the inner object if it was defined', () => {
            expect(getProps('props')).toBe('props')
            expect(getProps('value')).toBeUndefined()
        })
    })

    describe('#getValueAsync', () => {
        let getValueAsync

        beforeEach(() => {
            getValueAsync = factory.getValueAsync
        })

        it('should return promise with definedValue', (done) => {
            const expectedValue = 'expectedValue'
            let result

            getValueAsync()
                .then((data) => result = data)

            expect(result).toBeUndefined()
            done(() => {
                expect(result).toBe(expectedValue)
            })
        })
    })
})

describe('TestClass', () => {
    let testClass

    beforeEach(() => {
        testClass = new TestClass(externalFactory())
    })

    it('init value', () => {
        expect(testClass.factory).toBeDefined()
    })

    describe('#setValue', () => {
        it('should set value property as passed argument', () => {
            const value = 'value'

            testClass.setValue(value)

            expect(testClass.value).toBe(value)
        })
    })

    describe('#getValue', () => {
        it('should get value', () => {
            const value = 'value';

            testClass.value = value

            expect(testClass.getValue()).toBe(value)
        })

    })

    describe('#updatePropAccordingFactoryMethod', () => {
        let transformValueSpy
        const returnedValue = 'returnedValue'

        beforeEach(() => {
            transformValueSpy = jasmine.createSpy('transformValue').and.returnValue(returnedValue)
            testClass.factory.transformValue = transformValueSpy
        })

        it('should set props according #transformValue', () => {
            const props = 'props'
            const value = 'value'

            testClass.updatePropAccordingFactoryMethod(props, value)

            expect(testClass.props).toBe(returnedValue)
            expect(transformValueSpy).toHaveBeenCalledWith(value)

            expect(transformValueSpy.calls.count()).toBe(1)
        })
    })

    describe('getFormattedString', () => {
        beforeEach(() => {
            spyOn(externalLib, 'formatData')
        })

        it('should call #formatData and return its result', () => {
            const string = 'string'

            expect(testClass.getFormattedString(string)).toBeUndefined()
            expect(externalLib.formatData).toHaveBeenCalledWith(string)
        })
    })

    describe('#changeStatusAccodingCondition', () => {
        const expectedResult = 'expectedResult'

        beforeEach(() => {
            spyOn(testClass, 'getValue').and.returnValue(expectedResult)
            spyOn(externalLib, 'formatData')
        })

        it('should call #getValue if argument is true', () => {
            const result = testClass.changeStatusAccodingCondition(true)

            expect(testClass.getValue).toHaveBeenCalled()
            expect(result).toBe(expectedResult)
        })

        it('should return #formatData which was called with result of #getValue if argument is false', () => {
            externalLib.formatData.and.callFake(() => expectedResult)

            const result = testClass.changeStatusAccodingCondition(false)

            expect(testClass.getValue).toHaveBeenCalledWith()
            expect(externalLib.formatData).toHaveBeenCalledWith(expectedResult)
            expect(result).toBe(expectedResult)
        })
    })

    describe('#workWithPromise', () => {
        const expectedValue = 'expectedValue'

        const initCases = (returnedValue) => {
            testClass.factory.getValueAsync.and.returnValue(returnedValue)
            testClass.workWithPromise()
        }

        beforeEach(() => {
            spyOn(testClass.factory,  'getValueAsync')
        })

        beforeEach(() => {
            spyOn(testClass, 'setValue')
            spyOn(testClass, 'updatePropAccordingFactoryMethod')
        })

        it('should return promise and call #setValue if promise was resolved', (done) => {
            const promise = new Promise((resolve) => resolve(expectedValue))
            initCases(promise)

            expect(testClass.setValue).not.toHaveBeenCalled()
            done(() => {
                expect(testClass.setValue).toHaveBeenCalledWith(expectedValue)
            })
        })

        it('should return promise and call #updatePropAccordingFactoryMethod if promise was rejected', (done) => {
            const promise = new Promise((resolve, reject) => reject(expectedValue))
            initCases(promise)

            expect(testClass.updatePropAccordingFactoryMethod).not.toHaveBeenCalled()
            done(() => {
                expect(testClass.updatePropAccordingFactoryMethod).toHaveBeenCalled(expectedValue)
            })
        })
    })
})

