const soap = require('soap');
const http = require('http');

const service = {
  CalculatorService: {
    CalculatorServiceSoapPort: {
      add: function (args) {
        const num1 = args.num1;
        const num2 = args.num2;
        const result = num1 + num2;
        return {
          result: result
        };
      }
    }
  }
};

const xml = `
<definitions xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
             xmlns:web="http://www.example.com/soap"
             xmlns:wsoap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
             targetNamespace="http://www.example.com/soap">
  <message name="AddRequest">
    <part name="num1" type="xsd:int"/>
    <part name="num2" type="xsd:int"/>
  </message>
  <message name="AddResponse">
    <part name="result" type="xsd:int"/>
  </message>
  <portType name="CalculatorServicePortType">
    <operation name="add">
      <input message="web:AddRequest"/>
      <output message="web:AddResponse"/>
    </operation>
  </portType>
  <binding name="CalculatorServiceBinding" type="web:CalculatorServicePortType">
    <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="add">
      <soap:operation soapAction="add"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>
  <service name="CalculatorService">
    <port name="CalculatorServiceSoapPort" binding="web:CalculatorServiceBinding">
      <soap:address location="http://localhost:8000/calculator"/>
    </port>
  </service>
</definitions>
`;

const server = http.createServer(function (req, res) {
  res.end("404: Not Found");
});

const soapServer = soap.listen(server, '/calculator', service, xml);

server.listen(8000, () => {
  console.log('SOAP Server running on http://localhost:8000/calculator');
});
