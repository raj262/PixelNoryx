import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthPasswordField } from "@/components/auth/AuthCard";

describe("AuthPasswordField", () => {
  it("renders password hidden by default", () => {
    render(
      <AuthPasswordField
        id="password"
        label="Password"
        value="secret"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <AuthPasswordField
        id="password"
        label="Password"
        value="secret"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Password");
    await user.click(screen.getByRole("button", { name: /show password/i }));

    expect(input).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });
});
