import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Habit } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { name } = await req.json();
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const newHabit = await Habit.create({
      userId: user.id,
      name,
      streak: 0,
      history: []
    });

    return NextResponse.json(newHabit);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const habits = await Habit.find({ userId: user.id, isActive: true });

    return NextResponse.json(habits);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { habitId, status, whyMissed } = await req.json();
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const habit = await Habit.findOne({ _id: habitId, userId: user.id });

    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    habit.history.push({
      date: new Date(),
      status,
      whyMissed
    });

    if (status === 'done') {
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }

    await habit.save();
    return NextResponse.json(habit);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
