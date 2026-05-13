import { useState, useCallback } from 'react';

export function useFileProcessor<TInput, TOutput>() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<TOutput | null>(null);

  const process = useCallback(async (
    input: TInput,
    processorFn: (input: TInput) => Promise<TOutput>
  ) => {
    setIsProcessing(true);
    setError(null);
    setOutput(null);

    try {
      const result = await processorFn(input);
      setOutput(result);
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
    setOutput(null);
  }, []);

  return { isProcessing, error, output, process, reset, setError, setOutput };
}
