import { useQuery } from "@tanstack/react-query";
import { getVoiceCapability } from "@/lib/voice.functions";

export function useVoiceCapability() {
  const { data } = useQuery({
    queryKey: ["voice-capability"],
    queryFn: () => getVoiceCapability(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return data ?? { available: false, saveAudio: false };
}