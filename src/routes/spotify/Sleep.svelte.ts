import NoSleep from "nosleep.js";

export const Sleep = () => {
  var nosleep: NoSleep;
  let disabled = $state<boolean>();

  return {
    get disabled() {
      return disabled;
    },
    set disabled(v: boolean | undefined) {
      if (nosleep === undefined) nosleep = new NoSleep();

      v ? nosleep.enable() : nosleep.disable();
      disabled = v;
    },
  };
};
