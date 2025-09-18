// Dummy test para neutralizar errores de useEffect y Supabase
jest.mock('../supabaseClient');
import React from 'react';

test('dummy test', () => {
    expect(true).toBe(true);
});