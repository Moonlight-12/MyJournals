const { ObjectId } = require('mongodb');
const { updateStreak } = require('./streakservice');
const { getDb } = require('./database');

jest.mock('./database');

describe('Streak functionality', () => {
  let mockUser;
  let mockCollection;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn()
    };
    
    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection)
    });
    
    mockUser = {
      _id: new ObjectId(),
      streak: {
        count: 1,
        lastEntryDate: new Date('2023-05-01T12:00:00Z').toISOString()
      }
    };
    
    mockCollection.findOne.mockResolvedValue(mockUser);
  });
  
  test('Streak should not increase for multiple entries on the same day', async () => {
    const sameDay = new Date('2023-05-01T18:00:00Z');
    
    console.log('Before updateStreak call - mockUser:', mockUser);
    const result = await updateStreak(mockUser._id.toString(), sameDay);
    console.log('After updateStreak call - result:', result);
    
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) });
    expect(result).toBe(1);
  });
  
  test('Streak should increase for an entry on the next consecutive day', async () => {
    const nextDay = new Date('2023-05-02T12:00:00Z');
    
    console.log('Before updateStreak call - mockUser:', mockUser);
    const result = await updateStreak(mockUser._id.toString(), nextDay);
    console.log('After updateStreak call - result:', result);
    
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) });
    expect(result).toBe(2);
  });
  
  test('Streak should reset if more than one day is skipped', async () => {
    const skipDay = new Date('2023-05-03T12:00:00Z');
    
    console.log('Before updateStreak call - mockUser:', mockUser);
    const result = await updateStreak(mockUser._id.toString(), skipDay);
    console.log('After updateStreak call - result:', result);
    
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) });
    expect(result).toBe(1);
  });
});