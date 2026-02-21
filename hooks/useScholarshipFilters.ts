import { useState, useMemo, useEffect } from "react";
import { Scholarship, Filters, FilterOptions } from "@/types/scholarship";

export const useScholarshipFilters = (scholarshipsData: unknown) => {
  const [filters, setFilters] = useState<Filters>({
    type: "",
    level: "",
    country: "", // This will now store selected country
    fieldOfStudy: "", // This will now store selected field
  });
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    levels: [],
    countries: [],
    fields: [],
    // keep internal values lowercase to match processing below
    types: ["fully funded", "partial", "paid", "self funded"],
  });

  // Process scholarships data with proper typing
  const scholarships = useMemo((): Scholarship[] => {
    if (!scholarshipsData) {
      return [];
    }

    if (Array.isArray(scholarshipsData)) {
      return scholarshipsData as Scholarship[];
    }

    if (scholarshipsData && typeof scholarshipsData === "object") {
      const data = scholarshipsData as Record<string, unknown>;

      if (data.data && Array.isArray(data.data)) {
        return data.data as Scholarship[];
      }

      if (data.scholarships && Array.isArray(data.scholarships)) {
        return data.scholarships as Scholarship[];
      }
    }

    return [];
  }, [scholarshipsData]);

  // Extract unique filter options with proper type assertions
  useEffect(() => {
    if (scholarships.length > 0) {
      // Extract levels
      const levelsSet = new Set<string>();
      scholarships.forEach((s: Scholarship) => {
        if (s.level && typeof s.level === "string") {
          levelsSet.add(s.level);
        }
      });
      const uniqueLevels = Array.from(levelsSet).sort();

      // Extract countries - now handling array of strings
      const countriesSet = new Set<string>();
      scholarships.forEach((s: any) => {
        // country is an array of strings in your schema
        if (s.country && Array.isArray(s.country)) {
          s.country.forEach((country: string) => {
            if (country && typeof country === "string") {
              countriesSet.add(country);
            }
          });
        }
      });
      const uniqueCountries = Array.from(countriesSet).sort();

      // Extract fields of study - now using fieldOfStudy array
      const fieldsSet = new Set<string>();
      scholarships.forEach((s: any) => {
        // fieldOfStudy is an array of strings in your schema
        if (s.fieldOfStudy && Array.isArray(s.fieldOfStudy)) {
          s.fieldOfStudy.forEach((field: string) => {
            if (field && typeof field === "string") {
              fieldsSet.add(field);
            }
          });
        }
      });
      const uniqueFields = Array.from(fieldsSet).sort();

      // Extract universities for potential future use
      const universitiesSet = new Set<string>();
      scholarships.forEach((s: any) => {
        if (s.universities && Array.isArray(s.universities)) {
          s.universities.forEach((uni: string) => {
            if (uni && typeof uni === "string") {
              universitiesSet.add(uni);
            }
          });
        }
      });

      setFilterOptions({
        levels: uniqueLevels,
        countries: uniqueCountries,
        fields: uniqueFields,
        types: ["fully funded", "partial", "paid", "self funded"],
      });
    } else {
    }
  }, [scholarships]);

  // Filter scholarships based on selected filters
  const filteredScholarships = useMemo((): Scholarship[] => {
    let filtered = scholarships;

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter((s: any) => {
        const match = s.type === filters.type;
        return match;
      });
    }

    // Apply level filter
    if (filters.level) {
      filtered = filtered.filter((s: any) => {
        const match = s.level === filters.level;
        return match;
      });
    }

    // Apply country filter - check if selected country is in the country array
    if (filters.country) {
      filtered = filtered.filter((s: any) => {
        // Check if country array includes the selected country
        const match =
          s.country &&
          Array.isArray(s.country) &&
          s.country.includes(filters.country);
        return match;
      });
    }

    // Apply field filter - check if selected field is in fieldOfStudy array
    if (filters.fieldOfStudy) {
      filtered = filtered.filter((s: any) => {
        // Check if fieldOfStudy array includes the selected field
        const match =
          s.fieldOfStudy &&
          Array.isArray(s.fieldOfStudy) &&
          s.fieldOfStudy.includes(filters.fieldOfStudy);
        return match;
      });
    }

    // Apply saved filter if enabled
    if (showSavedOnly) {
      filtered = filtered.filter((s: Scholarship) => {
        return savedScholarships.includes(s._id);
      });
    }

    return filtered;
  }, [scholarships, filters, showSavedOnly, savedScholarships]);

  const toggleSave = (id: string) => {
    setSavedScholarships((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearFilters = () => {
    setFilters({ type: "", level: "", country: "", fieldOfStudy: "" });
    setShowSavedOnly(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const activeFilters = useMemo(() => {
    const filtersList = [];
    if (filters.type)
      filtersList.push({
        key: "type",
        label: `Type: ${
          filters.type === "fully funded"
            ? "Fully Funded"
            : filters.type === "partial"
              ? "Partial"
              : filters.type === "paid"
                ? "Paid"
                : "Self Funded"
        }`,
      });
    if (filters.level)
      filtersList.push({ key: "level", label: `Level: ${filters.level}` });
    if (filters.country)
      filtersList.push({
        key: "country",
        label: `Country: ${filters.country}`,
      });
    if (filters.fieldOfStudy)
      filtersList.push({
        key: "fieldOfStudy",
        label: `Field: ${filters.fieldOfStudy}`,
      });
    return filtersList;
  }, [filters]);

  return {
    filters,
    filterOptions,
    savedScholarships,
    showSavedOnly,
    filteredScholarships,
    activeFilterCount,
    activeFilters,
    toggleSave,
    handleFilterChange,
    removeFilter,
    clearFilters,
    setShowSavedOnly,
  };
};
