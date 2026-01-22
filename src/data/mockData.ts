import type { Product } from '../types';
import { ShoppingBag, Activity, Monitor, Sofa, Dumbbell, Car, Camera, Tent, Stethoscope, Watch, Bike, Smartphone, Baby } from 'lucide-react';

export const categories: any[] = [
    { id: '1', name: 'Appliances', slug: 'home-appliance', icon: ShoppingBag, count: 120 },
    { id: '2', name: 'Electronics', slug: 'electronics', icon: Monitor, count: 350 },
    { id: '3', name: 'Furniture', slug: 'furniture', icon: Sofa, count: 210 },
    { id: '4', name: 'Hospital Beds', slug: 'hospital-beds', icon: Activity, count: 45 },
    { id: '5', name: 'Fitness', slug: 'fitness', icon: Dumbbell, count: 85 },
    { id: '6', name: 'Vehicles', slug: 'vehicles', icon: Car, count: 60 },
    { id: '7', name: 'Cameras', slug: 'cameras', icon: Camera, count: 40 },
    { id: '8', name: 'Camping', slug: 'camping', icon: Tent, count: 25 },
    { id: '9', name: 'Medical', slug: 'medical', icon: Stethoscope, count: 150 },
    { id: '10', name: 'Watches', slug: 'watches', icon: Watch, count: 30 },
    { id: '11', name: 'Bikes', slug: 'bikes', icon: Bike, count: 55 },
    { id: '12', name: 'Mobile', slug: 'mobile', icon: Smartphone, count: 200 },
    { id: '13', name: 'Baby Gear', slug: 'baby-gear', icon: Baby, count: 70 },
];


export const featuredProducts: Product[] = [
    {
        id: '1',
        title: 'Samsung 13kg Top Load Washing Machine',
        category: 'Home Appliances',
        pricePerMonth: 949,
        location: 'Mumbai, Andheri West',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop',
        rating: 4.8
    },
    {
        id: '2',
        title: 'Electric ICU Hospital Bed with Mattress',
        category: 'Hospital Beds',
        pricePerMonth: 4500,
        location: 'Delhi, Karol Bagh',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1516574187841-693019815fb1?q=80&w=2070&auto=format&fit=crop', // Placeholder medical like
        rating: 5.0,
        description: 'Room Oil Heater - 11 Fins. This efficient heater provides consistent warmth without drying out the air, perfect for medium to large rooms.',
        specifications: [
            { label: 'Number of Fins', value: '11' },
            { label: 'Heating Power Settings', value: '1500W' },
            { label: 'Key Features', value: 'Thermostatic Heat Control, PTC Fan Heater, Overheat Protection' },
            { label: 'Mobility', value: 'Equipped with castor wheels' },
            { label: 'Power Input', value: '230 V, 50 Hz (AC)' },
            { label: 'Additional Features', value: 'Suitable for medium to large rooms, Quiet operation' }
        ]
    },
    {
        id: '3',
        title: 'MacBook Pro M2 14-inch',
        category: 'Electronics',
        pricePerMonth: 3500,
        location: 'Bangalore, Indiranagar',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=2026&auto=format&fit=crop',
        rating: 4.9
    },
    {
        id: '4',
        title: 'Modern L-Shaped Sofa (Grey)',
        category: 'Furniture',
        pricePerMonth: 1200,
        location: 'Pune, Viman Nagar',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
        rating: 4.7
    },
    {
        id: '5',
        title: 'Sony PlayStation 5 Console',
        category: 'Electronics',
        pricePerMonth: 1500,
        location: 'Hyderabad, Gachibowli',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2070&auto=format&fit=crop',
        rating: 4.9
    },
    {
        id: '6',
        title: 'Treadmill Commercial Grade',
        category: 'Fitness',
        pricePerMonth: 2200,
        location: 'Gurgaon, Sector 56',
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2069&auto=format&fit=crop',
        rating: 4.6
    }
];
