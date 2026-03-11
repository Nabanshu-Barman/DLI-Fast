
export interface Course {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
}

export interface RedeemedCode {
  id: string;
  code: string;
  courseTitle: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Deep Learning Fundamentals',
    description: 'Learn the core concepts of neural networks and how to build them using popular frameworks.',
    pointsRequired: 100,
    imageUrl: 'https://picsum.photos/seed/dl1/800/600',
  },
  {
    id: 'c2',
    title: 'CUDA C++ Programming',
    description: 'Master GPU acceleration and parallel computing to supercharge your applications.',
    pointsRequired: 250,
    imageUrl: 'https://picsum.photos/seed/dl2/800/600',
  },
  {
    id: 'c3',
    title: 'Computer Vision with Jetson',
    description: 'Deploy real-time AI vision models on edge devices like NVIDIA Jetson Nano.',
    pointsRequired: 150,
    imageUrl: 'https://picsum.photos/seed/dl3/800/600',
  },
  {
    id: 'c4',
    title: 'Large Language Models 101',
    description: 'Explore the architecture and fine-tuning techniques for modern LLMs.',
    pointsRequired: 200,
    imageUrl: 'https://picsum.photos/seed/dl4/800/600',
  },
  {
    id: 'c5',
    title: 'Robotics Simulation (Omniverse)',
    description: 'Design and test robotic systems in a photorealistic, physically accurate simulation.',
    pointsRequired: 300,
    imageUrl: 'https://picsum.photos/seed/dl5/800/600',
  },
  {
    id: 'c6',
    title: 'Generative AI for Media',
    description: 'Understand Diffusion models and GANs for high-quality image and video generation.',
    pointsRequired: 180,
    imageUrl: 'https://picsum.photos/seed/dl6/800/600',
  },
];

export const MOCK_HISTORY: RedeemedCode[] = [
  {
    id: 'h1',
    code: 'DL-X72-NV',
    courseTitle: 'Deep Learning Fundamentals',
    date: '2023-10-24',
    status: 'Approved',
  },
  {
    id: 'h2',
    code: 'CV-JSN-01',
    courseTitle: 'Computer Vision Basics',
    date: '2023-11-12',
    status: 'Pending',
  },
  {
    id: 'h3',
    code: 'NLP-LLM-XX',
    courseTitle: 'Natural Language Processing',
    date: '2023-12-05',
    status: 'Rejected',
  },
];

export const MOCK_ADMIN_REQUESTS = [
  { id: 'r1', user: 'alex.chen@example.com', course: 'CUDA Programming', points: 250, balance: 420 },
  { id: 'r2', user: 'sarah.smith@example.com', course: 'Robotics Sim', points: 300, balance: 120 },
  { id: 'r3', user: 'john.doe@example.com', course: 'Gen AI Workshop', points: 180, balance: 600 },
];
