import { TEST, TEST2 } from './app.js';

describe('methods', () => {
    const methods = [TEST, TEST2]
    const EXPECTED_VALUE = {
        TEST: 'test',
        TEST2: 'test2',
    }

    it('should return expected values', () => {
        methods.map((method) => expect(method()).toBe(EXPECTED_VALUE[method.name]))
    })
})