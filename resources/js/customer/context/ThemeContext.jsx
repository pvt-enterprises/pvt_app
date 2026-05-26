import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        axios.get('/settings')
            .then(res => {
                if (res.data.success) {
                    const s = res.data.data;
                    const root = document.documentElement;

                    root.style.setProperty('--main-color',    s.main_color    ?? '#e4e590');
                    root.style.setProperty('--white-color',   s.white_color   ?? '#ffffff');
                    root.style.setProperty('--color-one',     s.color_one     ?? '#a7a7a7');
                    root.style.setProperty('--color-two',     s.color_two     ?? '#0e0d0b');
                    root.style.setProperty('--color-three',   s.color_three   ?? '#699b65');
                    root.style.setProperty('--color-four',    s.color_four    ?? '#171819');
                    root.style.setProperty('--color-five',    s.color_five    ?? '#0c0d0c');
                    root.style.setProperty('--color-six',     s.color_six     ?? '#1a1b1c');
                    root.style.setProperty('--color-seven',   s.color_seven   ?? '#151616');
                    root.style.setProperty('--color-eight',   s.color_eight   ?? '#121111');
                    root.style.setProperty('--black-color',   s.black_color   ?? '#000000');
                    root.style.setProperty('--text-color',    s.text_color    ?? '#ffffff');
                    root.style.setProperty('--heading-color', s.heading_color ?? '#ffffff');

                    setTheme(s);
                }
            })
            .catch(err => console.error('Theme fetch failed:', err));
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);