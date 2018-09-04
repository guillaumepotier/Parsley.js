import setup_ew from './expect_warning';
import setup_dlc from './dom_leak_check';


export default function() {
  beforeEach(function() {
    this.sandbox = global.sinon.sandbox.create();
    global.stub = this.sandbox.stub.bind(this.sandbox);
    global.spy = this.sandbox.spy.bind(this.sandbox);
  });

  afterEach(function() {
    delete global.stub;
    delete global.spy;
    this.sandbox.restore();
  });

  setup_ew();
  setup_dlc();
}
