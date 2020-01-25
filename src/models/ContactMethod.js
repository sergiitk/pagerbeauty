// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

// ------- ContactMethod -------------------------------------------------------

export class ContactMethod {
  constructor({
    type,
    summary,
    address,
  }) {
    this.type = type;
    this.summary = summary;
    this.address = address;
  }

  serialize() {
    return {
      type: this.type,
      summary: this.summary,
      address: this.address,
    };
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  static fromApiRecord(record) {
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
