class XmlFeedService {
  /**
   * Generates an XML string for job boards (e.g., Indeed, ZipRecruiter).
   * @param {Array} jobPosts - Array of job post objects { id, title, description, city, state, date, url }.
   * @returns {string} - The XML string.
   */
  generateJobFeed(jobPosts) {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
    xml += '<source>\n';
    xml += '  <publisher>Funnel CRM Recruiting</publisher>\n';
    xml += '  <publisherurl>https://funnelcrm.com</publisherurl>\n';
    xml += '  <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\n';

    jobPosts.forEach(job => {
      xml += '  <job>\n';
      xml += `    <title><![CDATA[${job.title}]]></title>\n`;
      xml += `    <date><![CDATA[${job.date}]]></date>\n`;
      xml += `    <referencenumber><![CDATA[${job.id}]]></referencenumber>\n`;
      xml += `    <url><![CDATA[${job.url}]]></url>\n`;
      xml += `    <city><![CDATA[${job.city}]]></city>\n`;
      xml += `    <state><![CDATA[${job.state}]]></state>\n`;
      xml += `    <country><![CDATA[US]]></country>\n`;
      xml += `    <description><![CDATA[${job.description}]]></description>\n`;
      xml += '  </job>\n';
    });

    xml += '</source>';
    return xml;
  }
}

module.exports = new XmlFeedService();
