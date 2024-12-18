#!/bin/bash
if [ "$BRANCH" != "main" ]; then
  echo "Error: Cannot deploy from branch '$BRANCH'. Deploy is restricted to 'main' branch only."
  exit 1
fi
