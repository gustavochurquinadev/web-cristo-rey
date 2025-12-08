import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const PageTransition = ({ children }) => {
    const elementRef = useRef(null);
    const curtainRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // ESTADO INICIAL: El telón cubre la pantalla (evita flash de contenido)
            // ANIMACIÓN: El telón sube y revela el contenido
            tl.set(curtainRef.current, {
                scaleY: 1,
                transformOrigin: "bottom center"
            })
                .to(curtainRef.current, {
                    scaleY: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                    delay: 0.1
                })
                .from(elementRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6"); // Se superpone ligeramente para mayor fluidez

        }, elementRef);

        return () => ctx.revert();
    }, []); // Se ejecuta cada vez que el componente se monta (cambio de ruta)

    return (
        <div ref={elementRef} className="relative w-full min-h-screen">
            {/* El Telón (Overlay) */}
            <div
                ref={curtainRef}
                className="fixed inset-0 bg-cristo-primary z-[9999] pointer-events-none"
                style={{ transform: 'scaleY(1)' }}
            />
            {children}
        </div>
    );
};

export default PageTransition;