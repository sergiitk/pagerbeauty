// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

// ------- ContactMethod -------------------------------------------------------

export class ContactMethod {
  constructor({
    type,
    summary,
    address,
    userId,
  }) {
    this.type = type;
    this.summary = summary;
    this.address = address;
    this.userId = userId;
  }

  serialize() {
    return {
      type: this.type,
      summary: this.summary,
      address: this.address,
      userId: this.userId,
    };
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  static fromApiRecord(record, userId) {
    const attributes = {
      type: record.type,
      summary: record.summary,
      address: record.address,
    };
    return new ContactMethod(attributes);
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
