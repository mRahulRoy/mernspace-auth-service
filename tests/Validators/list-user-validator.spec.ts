import { customFeildSantizer } from '../../src/validators/list-users-validators';

// added test for the custom sanitizer
describe('Testing sanitizer function', () => {
    it('should return empty string when no value is passed', () => {
        expect(customFeildSantizer('hello')).toBe('hello');
        expect(customFeildSantizer('')).toBe('');
        expect(customFeildSantizer(undefined)).toBe('');
        expect(customFeildSantizer(null)).toBe('');
    });
});
