// 

import { OnboardingStep } from "../../entities/business/business.entity";

export interface FilterType {
  page: string,
  limit: string,
}

export interface BusiFilterType extends FilterType {
  state: OnboardingStep
}