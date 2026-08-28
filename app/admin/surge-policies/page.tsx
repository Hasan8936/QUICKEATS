import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export default async function SurgePoliciesAdmin() {
  const policies = await prisma.surgePolicy.findMany({
    include: { zone: true }
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Surge Policies Administration</h1>
        <p className="mb-8 text-[var(--color-text-muted)]">
          Manage surge pricing policies for each zone. Policies define the threshold and multiplier
          for surge pricing activation.
        </p>

        <div className="bg-white rounded-lg shadow-[var(--shadow-sm)] p-6">
          <h2 className="text-xl font-bold mb-4">Current Surge Policies</h2>
          {policies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--color-border)]">
                <thead className="bg-[var(--color-background)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[var(--color-text-muted)] font-medium text-sm uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-[var(--color-text-muted)] font-medium text-sm uppercase tracking-wider">
                      Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-[var(--color-text-muted)] font-medium text-sm uppercase tracking-wider">
                      Multiplier
                    </th>
                    <th className="px-6 py-3 text-left text-[var(--color-text-muted)] font-medium text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {policies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-[var(--color-background)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                        {policy.zone?.name || policy.zoneId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                        {policy.threshold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                        {policy.multiplier}x
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => editPolicy(policy)}
                          className="text-[var(--color-primary-orange)] hover:text-[var(--color-primary-orange-dark)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePolicy(policy.id)}
                          className="text-[var(--color-danger)] hover:text-[var(--color-danger-dark)]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center py-8">
              No surge policies configured yet.
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-bold mb-4">Add New Policy</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Zone ID</label>
                  <input
                    type="text"
                    id="zoneId"
                    required
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Threshold</label>
                  <input
                    type="number"
                    id="threshold"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Multiplier</label>
                  <input
                    type="number"
                    id="multiplier"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    required
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-[var(--color-primary-orange)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-orange-dark)] transition-colors"
              >
                Save Policy
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const zoneId = (form.elements.namedItem('zoneId') as HTMLInputElement).value;
    const threshold = parseInt((form.elements.namedItem('threshold') as HTMLInputElement).value);
    const multiplier = parseFloat((form.elements.namedItem('multiplier') as HTMLInputElement).value);

    if (!zoneId || isNaN(threshold) || isNaN(multiplier)) {
      alert('Please fill all fields correctly');
      return;
    }

    try {
      await prisma.surgePolicy.upsert({
        where: { zoneId },
        update: { threshold, multiplier },
        create: { zoneId, threshold, multiplier },
      });

      // Invalidate cache
      await redis.del(`surge:${zoneId}`);

      // Notify via pub/sub for real-time updates
      await redis.publish('surge-updates', JSON.stringify({ zoneId, multiplier }));

      alert('Policy saved successfully!');
      // Reload page to show updated policies
      window.location.reload();
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Failed to save policy. Please try again.');
    }
  }

  async function editPolicy(policy: any) {
    // In a real implementation, this would populate the form with existing values
    alert(`Edit functionality would populate form with policy for ${policy.zoneId}`);
  }

  async function deletePolicy(zoneId: string) {
    if (!window.confirm(`Are you sure you want to delete the surge policy for zone ${zoneId}?`)) {
      return;
    }

    try {
      await prisma.surgePolicy.delete({ where: { zoneId } });
      await redis.del(`surge:${zoneId}`);
      await redis.publish('surge-updates', JSON.stringify({ zoneId, multiplier: 1.0 }));
      alert('Policy deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting policy:', error);
      alert('Failed to delete policy. Please try again.');
    }
  }
}