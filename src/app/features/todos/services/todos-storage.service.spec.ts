import { TodoItem } from '../todo.model';
import { TODOS_STORAGE_KEY, TodosStorageService } from './todos-storage.service';

describe('TodosStorageService', () => {
  let service: TodosStorageService;

  const validItem: TodoItem = {
    id: 'abc-1',
    title: 'Write the spec',
    completed: false,
    createdAt: new Date('2026-03-16T08:00:00.000Z'),
  };

  beforeEach(() => {
    localStorage.clear();
    service = new TodosStorageService();
  });

  describe('load()', () => {
    it('should return an empty array when the storage key is absent', () => {
      expect(service.load()).toEqual([]);
    });

    it('should return an empty array when the stored value is malformed JSON', () => {
      localStorage.setItem(TODOS_STORAGE_KEY, '{not-valid-json');
      expect(service.load()).toEqual([]);
    });

    it('should return an empty array when the stored value is not an array', () => {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
      expect(service.load()).toEqual([]);
    });

    it('should skip null array entries', () => {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify([null]));
      expect(service.load()).toEqual([]);
    });

    it('should skip entries with missing or wrongly-typed fields', () => {
      localStorage.setItem(
        TODOS_STORAGE_KEY,
        JSON.stringify([
          { id: 123, title: 'Bad', completed: false, createdAt: '2026-01-01T00:00:00.000Z' },
        ]),
      );
      expect(service.load()).toEqual([]);
    });

    it('should skip entries with an invalid date string', () => {
      localStorage.setItem(
        TODOS_STORAGE_KEY,
        JSON.stringify([{ id: 'x', title: 'Bad date', completed: false, createdAt: 'not-a-date' }]),
      );
      expect(service.load()).toEqual([]);
    });

    it('should return hydrated TodoItem objects for valid stored entries', () => {
      service.persist([validItem]);
      const result = service.load();

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(validItem.id);
      expect(result[0]?.title).toBe(validItem.title);
      expect(result[0]?.completed).toBe(validItem.completed);
      expect(result[0]?.createdAt).toBeInstanceOf(Date);
      expect(result[0]?.createdAt.toISOString()).toBe(validItem.createdAt.toISOString());
    });
  });

  describe('persist()', () => {
    it('should write todos as ISO date strings to local storage', () => {
      service.persist([validItem]);

      const raw = localStorage.getItem(TODOS_STORAGE_KEY);
      expect(raw).not.toBeNull();

      const stored = JSON.parse(raw ?? '[]') as Array<{ createdAt: string }>;
      expect(stored).toHaveLength(1);
      expect(stored[0]?.createdAt).toBe(validItem.createdAt.toISOString());
    });

    it('should overwrite previously persisted todos', () => {
      service.persist([validItem]);
      service.persist([]);

      const raw = localStorage.getItem(TODOS_STORAGE_KEY);
      expect(JSON.parse(raw ?? 'null')).toEqual([]);
    });
  });
});
