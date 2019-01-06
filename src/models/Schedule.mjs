// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

// ------- Schedule ------------------------------------------------------------

export class Schedule {
  constructor({
    id,
    name,
    timezone,
    url,
    summary,
    description,
    escalationPolicies = [],
  }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.timezone = timezone;
    this.summary = summary;
    this.description = description;
    this.escalationPolicies = new Set(escalationPolicies);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      timezone: this.timezone,
      summary: this.summary,
      description: this.description,
      escalationPolicies: Array.from(this.escalationPolicies),
    };
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  static fromApiRecord(record) {
    const attributes = {
      id: record.id,
      name: record.name,
      url: record.html_url,
      timezone: record.time_zone,
      summary: record.summary,
      description: record.description,
    };
    const escalationPolicies = record.escalation_policies;
    if (escalationPolicies) {
      attributes.escalationPolicies = escalationPolicies.map(policy => policy.id);
    }
    return new Schedule(attributes);
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
