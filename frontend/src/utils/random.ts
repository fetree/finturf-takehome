const COMPANY_SUFFIXES = ["Inc", "LLC", "Co", "Group", "Partners", "Ventures", "Solutions", "Holdings"];
const COMPANY_PREFIXES = ["Atlas", "Apex", "Blue", "Cedar", "Crest", "Delta", "Echo", "Forge", "Harbor", "Iris", "Jade", "Knox", "Lumen", "Mesa", "Nova", "Orbit", "Peak", "Quinn", "Ridge", "Summit"];
const FIRST_NAMES = ["Alex", "Blake", "Casey", "Dana", "Drew", "Evan", "Finley", "Harper", "Jordan", "Kennedy", "Lane", "Morgan", "Parker", "Quinn", "Riley", "Skyler", "Taylor", "Avery", "Cameron", "Devon"];
const LAST_NAMES = ["Anderson", "Brooks", "Carter", "Davis", "Evans", "Foster", "Garcia", "Harris", "Irving", "Jensen", "Kim", "Lopez", "Martin", "Nguyen", "Owens", "Patel", "Reed", "Silva", "Torres", "Walker"];
const BUSINESS_TYPES = ["llc", "corporation", "sole_proprietor", "partnership", "nonprofit"];
const STATES = ["CA", "NY", "TX", "FL", "WA", "IL", "MA", "CO", "GA", "AZ"];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (n: number, len: number) => String(n).padStart(len, "0");

export function randomBusiness() {
  const prefix = pick(COMPANY_PREFIXES);
  const suffix = pick(COMPANY_SUFFIXES);
  const name = `${prefix} ${suffix}`;
  const slug = prefix.toLowerCase();
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);

  const year = randInt(1980, 2022);
  const month = pad(randInt(1, 12), 2);
  const day = pad(randInt(1, 28), 2);

  return {
    name,
    ein: `${pad(randInt(10, 99), 2)}-${pad(randInt(1000000, 9999999), 7)}`,
    business_type: pick(BUSINESS_TYPES),
    state: pick(STATES),
    website: `https://www.${slug}.com`,
    date_founded: `${year}-${month}-${day}`,
    owner_name: `${firstName} ${lastName}`,
  };
}
