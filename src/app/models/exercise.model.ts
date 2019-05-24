export interface Exercise {
    id: string;
    name: string;
    duration: number;
    met: number;
    repetitions: number;
    calories?: number;
    date?: Date;
    state?: 'completed' | 'cancelled' | null;
}

// export interface Exercise {
//     sets?: number;
//     rest?: number;
// }
