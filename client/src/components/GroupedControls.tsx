import { EmergencyMix } from '@/components/EmergencyMix';
import { AudioReactive } from '@/components/AudioReactive';
import { WorkspaceLayoutSaver } from '@/components/WorkspaceLayoutSaver';

export function GroupedControls() {
  return (
    <div className="flex items-center space-x-2">
      <EmergencyMix />
      <AudioReactive />
      <WorkspaceLayoutSaver />
    </div>
  );
}