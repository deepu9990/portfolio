/**
 * Performance monitoring utility with timing and benchmarking capabilities
 * Provides detailed metrics for Shopify sync operations
 */

const { createLogger } = require('./logger');

class PerformanceMonitor {
  constructor(options = {}) {
    this.logger = options.logger || createLogger({ module: 'PERFORMANCE' });
    this.timers = new Map();
    this.metrics = new Map();
    this.counters = new Map();
    this.enabled = options.enabled !== false;
    this.memorySnapshots = [];
  }

  // High-precision timing
  startTimer(name, metadata = {}) {
    if (!this.enabled) return;
    
    const timer = {
      name,
      startTime: process.hrtime.bigint(),
      startMemory: process.memoryUsage(),
      metadata,
      childTimers: []
    };
    
    this.timers.set(name, timer);
    this.logger.debug(`Timer started: ${name}`, metadata);
    return name;
  }

  endTimer(name) {
    if (!this.enabled) return null;
    
    const timer = this.timers.get(name);
    if (!timer) {
      this.logger.warn(`Timer not found: ${name}`);
      return null;
    }

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    const duration = Number(endTime - timer.startTime) / 1000000; // Convert to milliseconds

    const result = {
      name: timer.name,
      duration,
      startTime: timer.startTime,
      endTime,
      memoryUsage: {
        initial: timer.startMemory,
        final: endMemory,
        delta: {
          rss: endMemory.rss - timer.startMemory.rss,
          heapUsed: endMemory.heapUsed - timer.startMemory.heapUsed,
          external: endMemory.external - timer.startMemory.external
        }
      },
      metadata: timer.metadata,
      childTimers: timer.childTimers
    };

    this.timers.delete(name);
    this._addMetric(name, result);
    
    this.logger.info(`Timer completed: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
      memoryDelta: `${(result.memoryUsage.delta.heapUsed / 1024 / 1024).toFixed(2)}MB`
    });

    return result;
  }

  // Nested timing support
  startChildTimer(parentName, childName) {
    if (!this.enabled) return;
    
    const parent = this.timers.get(parentName);
    if (!parent) {
      this.logger.warn(`Parent timer not found: ${parentName}`);
      return;
    }

    const childTimer = {
      name: childName,
      startTime: process.hrtime.bigint()
    };

    parent.childTimers.push(childTimer);
    return `${parentName}.${childName}`;
  }

  endChildTimer(parentName, childName) {
    if (!this.enabled) return null;
    
    const parent = this.timers.get(parentName);
    if (!parent) return null;

    const childTimer = parent.childTimers.find(t => t.name === childName);
    if (!childTimer) return null;

    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - childTimer.startTime) / 1000000;

    childTimer.endTime = endTime;
    childTimer.duration = duration;

    return childTimer;
  }

  // Counter for tracking operations
  incrementCounter(name, value = 1) {
    if (!this.enabled) return;
    
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
  }

  getCounter(name) {
    return this.counters.get(name) || 0;
  }

  resetCounter(name) {
    this.counters.set(name, 0);
  }

  // Memory monitoring
  takeMemorySnapshot(label) {
    if (!this.enabled) return;
    
    const snapshot = {
      label,
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
    
    this.memorySnapshots.push(snapshot);
    return snapshot;
  }

  // Benchmark function execution
  benchmark(name, fn, iterations = 1) {
    if (!this.enabled) {
      return fn();
    }

    const results = [];
    let totalDuration = 0;

    for (let i = 0; i < iterations; i++) {
      const timerName = `${name}_iter_${i}`;
      this.startTimer(timerName);
      
      const result = fn();
      
      const timing = this.endTimer(timerName);
      if (timing) {
        results.push(timing);
        totalDuration += timing.duration;
      }
    }

    const benchmark = {
      name,
      iterations,
      results,
      totalDuration,
      averageDuration: totalDuration / iterations,
      minDuration: Math.min(...results.map(r => r.duration)),
      maxDuration: Math.max(...results.map(r => r.duration))
    };

    this.logger.info(`Benchmark completed: ${name}`, {
      iterations,
      average: `${benchmark.averageDuration.toFixed(2)}ms`,
      min: `${benchmark.minDuration.toFixed(2)}ms`,
      max: `${benchmark.maxDuration.toFixed(2)}ms`
    });

    return benchmark;
  }

  // Async benchmark
  async benchmarkAsync(name, fn, iterations = 1) {
    if (!this.enabled) {
      return await fn();
    }

    const results = [];
    let totalDuration = 0;

    for (let i = 0; i < iterations; i++) {
      const timerName = `${name}_iter_${i}`;
      this.startTimer(timerName);
      
      const result = await fn();
      
      const timing = this.endTimer(timerName);
      if (timing) {
        results.push(timing);
        totalDuration += timing.duration;
      }
    }

    const benchmark = {
      name,
      iterations,
      results,
      totalDuration,
      averageDuration: totalDuration / iterations,
      minDuration: Math.min(...results.map(r => r.duration)),
      maxDuration: Math.max(...results.map(r => r.duration))
    };

    this.logger.info(`Async benchmark completed: ${name}`, {
      iterations,
      average: `${benchmark.averageDuration.toFixed(2)}ms`,
      min: `${benchmark.minDuration.toFixed(2)}ms`,
      max: `${benchmark.maxDuration.toFixed(2)}ms`
    });

    return benchmark;
  }

  // Rate monitoring
  trackRate(name, value = 1) {
    if (!this.enabled) return;
    
    const now = Date.now();
    const key = `${name}_rate`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        startTime: now,
        lastUpdate: now
      });
    }

    const metric = this.metrics.get(key);
    metric.count += value;
    metric.lastUpdate = now;
  }

  getRate(name) {
    const key = `${name}_rate`;
    const metric = this.metrics.get(key);
    
    if (!metric) return 0;
    
    const duration = (metric.lastUpdate - metric.startTime) / 1000; // seconds
    return duration > 0 ? metric.count / duration : 0;
  }

  // Get comprehensive metrics
  getMetrics() {
    return {
      timers: Array.from(this.metrics.entries()),
      counters: Array.from(this.counters.entries()),
      memorySnapshots: this.memorySnapshots,
      rates: Array.from(this.metrics.entries())
        .filter(([key]) => key.endsWith('_rate'))
        .map(([key, value]) => [key.replace('_rate', ''), this.getRate(key.replace('_rate', ''))])
    };
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getMetrics();
    const currentMemory = process.memoryUsage();
    
    const report = {
      timestamp: new Date().toISOString(),
      memory: {
        current: currentMemory,
        snapshots: this.memorySnapshots
      },
      timers: metrics.timers,
      counters: metrics.counters,
      rates: metrics.rates,
      summary: {
        totalOperations: Array.from(this.counters.values()).reduce((sum, val) => sum + val, 0),
        activeTimers: this.timers.size,
        memoryUsage: `${(currentMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`
      }
    };

    this.logger.info('Performance report generated', report.summary);
    return report;
  }

  // Reset all metrics
  reset() {
    this.timers.clear();
    this.metrics.clear();
    this.counters.clear();
    this.memorySnapshots.length = 0;
    this.logger.info('Performance metrics reset');
  }

  // Private methods
  _addMetric(name, data) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(data);
  }

  // Enable/disable monitoring
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Singleton instance
const defaultMonitor = new PerformanceMonitor();

// Utility function for quick timing
function time(name, fn) {
  return defaultMonitor.benchmark(name, fn);
}

async function timeAsync(name, fn) {
  return defaultMonitor.benchmarkAsync(name, fn);
}

module.exports = {
  PerformanceMonitor,
  defaultMonitor,
  time,
  timeAsync,
  // Convenience exports
  startTimer: defaultMonitor.startTimer.bind(defaultMonitor),
  endTimer: defaultMonitor.endTimer.bind(defaultMonitor),
  incrementCounter: defaultMonitor.incrementCounter.bind(defaultMonitor),
  getCounter: defaultMonitor.getCounter.bind(defaultMonitor),
  takeMemorySnapshot: defaultMonitor.takeMemorySnapshot.bind(defaultMonitor),
  benchmark: defaultMonitor.benchmark.bind(defaultMonitor),
  benchmarkAsync: defaultMonitor.benchmarkAsync.bind(defaultMonitor),
  getMetrics: defaultMonitor.getMetrics.bind(defaultMonitor),
  generateReport: defaultMonitor.generateReport.bind(defaultMonitor)
};