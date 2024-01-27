import {
    customStringFeildSantizer,
    customIntFeildSantizer,
} from '../../src/validators/list-users-validators';

describe('Testing sanitizer function', () => {
    it('should return empty string when no value is passed', () => {
        expect(customStringFeildSantizer('hello')).toBe('hello');
        expect(customStringFeildSantizer('')).toBe('');
        expect(customStringFeildSantizer(undefined)).toBe('');
        expect(customStringFeildSantizer(null)).toBe('');
    });
    it('should return 1  when no value is passed', () => {
        expect(customIntFeildSantizer(12)).toBe(12);
        expect(customIntFeildSantizer('sdfsdfds')).toBe(1);
    });
});
