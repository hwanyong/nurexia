/**
 * node.test.ts - Tests for Node base class
 */

import { Node } from '../../widgets/node';

describe('Node', () => {
  // Basic instantiation
  test('should create a node with default options', () => {
    const node = new Node();
    expect(node).toBeInstanceOf(Node);
    expect(node.type).toBe('node');
    expect(node.children).toHaveLength(0);
    expect(node.parent).toBeNull();
    expect(node.screen).toBeNull();
  });

  // Event handling
  test('should properly handle events', () => {
    const node = new Node();
    const mockFn = jest.fn();

    node.on('test', mockFn);
    node.emit('test', 'arg1', 'arg2');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  // Parent-child relationship
  test('should establish parent-child relationships', () => {
    const parent = new Node();
    // We need to manually append the child
    const child = new Node();

    parent.append(child);

    expect(child.parent).toBe(parent);
    expect(parent.children).toContain(child);
  });

  test('should handle append and remove operations', () => {
    const parent = new Node();
    const child = new Node();

    parent.append(child);
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child);
    expect(child.parent).toBe(parent);

    parent.remove(child);
    expect(parent.children).toHaveLength(0);
    expect(child.parent).toBeNull();
  });

  // Destruction
  test('should properly destroy nodes and clean up references', () => {
    const parent = new Node();
    const child1 = new Node();
    const child2 = new Node();

    parent.append(child1);
    parent.append(child2);

    expect(parent.children).toHaveLength(2);

    child1.destroy();
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0]).toBe(child2);

    parent.destroy();
    expect(parent.children).toHaveLength(0);
    expect(child2.parent).toBeNull();
  });

  // Data storage
  test('should handle data storage', () => {
    const node = new Node();

    node.setData('key1', 'value1');
    node.setData('key2', { nested: 'value2' });

    expect(node.getData('key1')).toBe('value1');
    expect(node.getData('key2')).toEqual({ nested: 'value2' });
  });

  // Event bubbling
  test('should bubble events to parent', () => {
    const parent = new Node();
    const child = new Node();

    parent.append(child);

    const mockFn = jest.fn();
    parent.on('bubble-test', mockFn);

    child.bubble('bubble-test', 'arg1');

    // Check that mockFn was called
    expect(mockFn).toHaveBeenCalledTimes(1);
    // The parent's event handler should receive only the args (no child reference)
    expect(mockFn).toHaveBeenCalledWith('arg1');
  });
});