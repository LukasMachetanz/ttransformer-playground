export class TestComponent {

  /**
   * Should be transformed to public test = jasmine.createSpy();
   */
  public test(): string {
    return "test";
  }

}
