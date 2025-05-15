
# 🧠 Clode AI Agent Instructions for Drupal SDC Validation and Fixing

## 📁 Context

You are working within a Drupal environment using Single Directory Components (SDCs). Each component has `.twig` and `.yaml` files. The `sdc_develop` module provides tools to validate these components.

## 📁 Directory Setup
The root of the repo is located at:

```
/Users/o_o/www/civictheme/uikit
```

only look in this path 
```
/Users/o_o/www/civictheme/uikit/packages/sdc/components
```

Run all commands from the following directory:

```
tools/sdc
```

The build path is located in:

```
tools/sdc/build
```

---

## List components

```
build/vendor/bin/drush sdc-devel:validate civictheme_sdc --format=yaml
```

This will give you a list of components that require fixing. DO NOT SCAN FOR ANY COMPONENTS VIA FILE SYSTEM.


## 🔧 Validation Command

To validate an SDC component, use the following command:

```
build/vendor/bin/drush sdc-devel:validate civictheme_sdc civictheme_sdc:<component_name> --format=yaml
```

To retrieve the <component_name> - use the output of the command above. DO NOT SCAN FOR ANY COMPONENTS VIA FILE SYSTEM.

## 🧪 Unit Test Command

After making a change, run a unit test to validate the rendered Twig output from the root of the repo:
```bash
cd /Users/o_o/www/civictheme/uikit
npm run test --workspace=@civictheme/uikit-sdc
```

---

## 🔁 Repair & Validate Loop

For **each component** (starting from the **last** and proceeding **in reverse order**):

### a. **Attempt Fix**
- Apply a fix to the component based on validation output.
- Do not proceed to another component **until all issues are resolved**, or an exception is documented.

### b. **Run Unit Test**
- Immediately run the unit test using the command described above.

### c. **Handle Test Result**
- **If test passes**:
  - Log the fix in `myfixes.md` (see logging format below).
  - Prompt the user:
    > “Component `<component_name>` fixed and tests passed. Proceed to next component? (yes/no)”
- **If test fails**:
  - Revert the most recent change.
  - Retry with an alternative fix.
  - Repeat until successful or mark as an exception.
  - **Only update snapshots and accept these updates if there are only changes to white spaces. If there are other changes, consider this test as failed and stop execution.**

### d. **Logging Changes**
Record each action in `myfixes.md`:
```
### Component: <component_name>
- Action: Fixed/Skipped
- Description: <Brief description of what was changed or why it was skipped>
```

If an issue cannot be resolved and requires an exception:
```
### Component: <component_name>
- Action: Skipped
- Reason: <Reason for skipping, e.g. "Requires external library", "Specification conflict", etc.>
```

Do not add `All unit tests now pass` to the log.

---

## 🛑 Important Rules

- Always start with the **last component** and proceed **backwards**.
- **Do not skip a component** unless:
  - All options are exhausted.
  - It is explicitly marked in `myfixes.md` with a justification.
- Prompt for confirmation before moving to the next component.


## ❌ DO NOT

> These rules are strictly enforced. Breaking these rules is considered an invalid fix.
- ❌ **Do not run build.sh` - the environment is already built!
- ❌ **Do not modify any files** in `packages/twig`
- ❌ **Do not modify or remove** any use of the `|raw` filter.
- ❌ **Do not remove** default values in Twig, e.g. `{{ label|default('') }}` must stay intact.
- ❌ **Do not replace** expressions using `default('true')` or `default('false')` with ternary (`? :`) or `if` expressions.
- ❌ **Do not modify** `.gitignore`.
- ❌ **Do not skip components**
- ❌ **do not use <slot> for replacing markup!**
