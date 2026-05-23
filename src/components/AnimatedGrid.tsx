"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedGrid() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
        }> = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            // Generates a clean number of ambient floating matrix dots based on screen area
            const particleCount = Math.floor((canvas.width * canvas.height) / 9000);

            for (let i = 0; i < Math.min(particleCount, 120); i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3, // Ultra-slow drift speed
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                });
            }
        };

        const drawGridMesh = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background base tint matching your exact hex palette
            ctx.fillStyle = "#050507";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const maxDistance = 140; // Max line connection link range

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];

                // Update drift position coordinates
                p1.x += p1.vx;
                p1.y += p1.vy;

                // Perfect edge-bounce calculations
                if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

                // Render the node particle dots
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(77, 124, 254, 0.25)"; // Subtle blue accent nodes
                ctx.fill();

                // Check proximity coordinates to draw node link lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        // Fade lines in/out based on node distance proximity
                        const alpha = (1 - dist / maxDistance) * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(77, 124, 254, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(drawGridMesh);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        drawGridMesh();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}