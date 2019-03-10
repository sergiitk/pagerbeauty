// ------- Imports -------------------------------------------------------------

// This model to be compatible both with backend and frontend.

// ------- OnCall --------------------------------------------------------------

export class Incident {
  constructor({
    id,
    status,
    scheduleId,
    title,
    summary,
    url,
    serviceName,
    serviceUrl,
  }) {
    this.id = id;
    this.scheduleId = scheduleId;
    this.status = status;
    this.title = title;
    this.summary = summary;
    this.url = url;
    this.serviceName = serviceName;
    this.serviceUrl = serviceUrl;
  }

  serialize() {
    return {
      id: this.id,
      scheduleId: this.scheduleId,
      status: this.status,
      title: this.title,
      summary: this.summary,
      url: this.url,
      serviceName: this.serviceName,
      serviceUrl: this.serviceUrl,
    };
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  static fromApiRecord(record, scheduleId) {
    const attributes = {
      id: record.id,
      status: record.status,
      description: record.description,
      title: record.title,
      summary: record.summary,
      url: record.html_url,
      serviceName: record.service ? record.service.summary : 'Unknown',
      serviceUrl: record.service ? record.service.html_url : null,
      scheduleId,
    };
    return new Incident(attributes);
  }
  // ------- Class end  --------------------------------------------------------
}

// ------- End -----------------------------------------------------------------
